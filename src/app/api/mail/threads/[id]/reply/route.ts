import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { sendGmailReply } from '@/lib/gmail'
import { sendOutlookReply, refreshOutlookToken } from '@/lib/outlook'
import { sendZohoReply, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { body } = await request.json()
  if (!body?.trim()) return NextResponse.json({ error: 'Corps du message vide' }, { status: 400 })

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.id },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Thread introuvable' }, { status: 404 })

  const account = thread.account
  let token = account.accessToken

  // Extraire l'adresse email de l'expéditeur
  const toMatch = thread.sender.match(/<(.+)>/)
  const to = toMatch ? toMatch[1] : thread.sender

  try {
    if (account.provider === 'google') {
      await sendGmailReply(
        token,
        account.refreshToken ?? undefined,
        thread.threadId,
        '',
        to,
        thread.subject,
        body
      )
    } else if (account.provider === 'outlook') {
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshOutlookToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: token } })
      }
      await sendOutlookReply(token, thread.threadId, body)
    } else if (account.provider === 'zoho') {
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshZohoToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: token } })
      }
      const userInfo = await getZohoUserInfo(token)
      await sendZohoReply(token, userInfo.accountId, thread.threadId, to, thread.subject, body)
    }

    // Marquer comme lu après réponse
    await (prisma as any).emailThread.update({
      where: { id: params.id },
      data: { isUnread: false },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Reply error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
