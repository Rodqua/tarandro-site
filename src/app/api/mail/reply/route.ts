import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { sendGmailReply } from '@/lib/gmail'
import { sendOutlookReply, refreshOutlookToken } from '@/lib/outlook'
import { sendZohoReply, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { threadId, accountId, to, subject, body, messageId, inReplyTo } = await request.json()
  if (!threadId || !accountId || !to || !body) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const account = await (prisma as any).emailAccount.findUnique({ where: { id: accountId } })
  if (!account) return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 })

  try {
    let token = account.accessToken

    if (account.provider === 'google') {
      await sendGmailReply(
        token,
        account.refreshToken ?? undefined,
        threadId,
        inReplyTo || '',
        to,
        subject || '',
        body
      )
    } else if (account.provider === 'outlook') {
      // Refresh token si nécessaire
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshOutlookToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({
          where: { id: accountId },
          data: { accessToken: token, expiresAt: new Date(Date.now() + refreshed.expires_in * 1000) },
        })
      }
      await sendOutlookReply(token, messageId || threadId, body)
    } else if (account.provider === 'zoho') {
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshZohoToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({
          where: { id: accountId },
          data: { accessToken: token, expiresAt: new Date(Date.now() + refreshed.expires_in * 1000) },
        })
      }
      const userInfo = await getZohoUserInfo(token)
      await sendZohoReply(token, userInfo.accountId, messageId || threadId, to, subject || '', body)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Reply error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
