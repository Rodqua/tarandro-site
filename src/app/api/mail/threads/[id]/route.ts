import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread } from '@/lib/gmail'
import { deleteOutlookMessage, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.id },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Thread introuvable' }, { status: 404 })

  const account = thread.account
  let token = account.accessToken

  try {
    if (account.provider === 'google') {
      await trashGmailThread(token, account.refreshToken ?? undefined, thread.threadId)
    } else if (account.provider === 'outlook') {
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshOutlookToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: token } })
      }
      await deleteOutlookMessage(token, thread.threadId)
    } else if (account.provider === 'zoho') {
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshZohoToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({ where: { id: account.id }, data: { accessToken: token } })
      }
      const userInfo = await getZohoUserInfo(token)
      await deleteZohoMessage(token, userInfo.accountId, thread.threadId)
    }

    await (prisma as any).emailThread.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
