import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { trashGmailThread } from '@/lib/gmail'
import { deleteOutlookMessage, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, refreshZohoToken } from '@/lib/zoho'

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { threadId, accountId, messageId } = await request.json()
  if (!threadId || !accountId) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const account = await (prisma as any).emailAccount.findUnique({ where: { id: accountId } })
  if (!account) return NextResponse.json({ error: 'Compte introuvable' }, { status: 404 })

  try {
    let token = account.accessToken

    if (account.provider === 'google') {
      await trashGmailThread(token, account.refreshToken ?? undefined, threadId)
    } else if (account.provider === 'outlook') {
      if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
        const refreshed = await refreshOutlookToken(account.refreshToken)
        token = refreshed.access_token
        await (prisma as any).emailAccount.update({
          where: { id: accountId },
          data: { accessToken: token, expiresAt: new Date(Date.now() + refreshed.expires_in * 1000) },
        })
      }
      await deleteOutlookMessage(token, messageId || threadId)
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
      await deleteZohoMessage(token, userInfo.accountId, messageId || threadId)
    }

    // Supprimer de la DB locale
    await (prisma as any).emailThread.deleteMany({
      where: { threadId, accountId },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
