import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { trashGmailThread, markGmailThreadRead } from '@/lib/gmail'
import { deleteOutlookMessage, markOutlookMessageRead, refreshOutlookToken } from '@/lib/outlook'
import { deleteZohoMessage, getZohoUserInfo, markZohoMessageRead, refreshZohoToken } from '@/lib/zoho'

export const dynamic = 'force-dynamic'

async function getFreshToken(account: any): Promise<string> {
  if (!account.refreshToken) return account.accessToken
  // Si pas d'expiresAt stocké ou token expiré dans moins d'1 minute → refresh
  const isExpired = !account.expiresAt || new Date(account.expiresAt).getTime() < Date.now() + 60_000
  if (!isExpired) return account.accessToken

  try {
    if (account.provider === 'google') {
      const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      )
      client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      })
      const { credentials } = await client.refreshAccessToken()
      if (credentials.access_token) {
        await (prisma as any).emailAccount.update({
          where: { id: account.id },
          data: {
            accessToken: credentials.access_token,
            ...(credentials.expiry_date
              ? { expiresAt: new Date(credentials.expiry_date) }
              : {}),
          },
        })
        return credentials.access_token
      }
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      const tokens = await refreshOutlookToken(account.refreshToken)
      const expiresAt = tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null
      await (prisma as any).emailAccount.update({
        where: { id: account.id },
        data: {
          accessToken: tokens.access_token,
          ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
          ...(expiresAt ? { expiresAt } : {}),
        },
      })
      return tokens.access_token
    } else if (account.provider === 'zoho') {
      const tokens = await refreshZohoToken(account.refreshToken)
      const expiresAt = tokens.expires_in
        ? new Date(Date.now() + tokens.expires_in * 1000)
        : null
      await (prisma as any).emailAccount.update({
        where: { id: account.id },
        data: {
          accessToken: tokens.access_token,
          ...(expiresAt ? { expiresAt } : {}),
        },
      })
      return tokens.access_token
    }
  } catch (e) {
    console.warn('Token refresh failed:', e)
  }
  return account.accessToken
}

// Fallback : supprime tous les messages d'une conversation Outlook par conversationId
async function deleteOutlookConversation(conversationId: string, token: string): Promise<void> {
  // URLSearchParams encode le paramètre $filter correctement (le conversationId garde ses '=' littéraux)
  const qs = new URLSearchParams({
    '$filter': `conversationId eq '${conversationId}'`,
    '$select': 'id',
    '$top': '50',
  })
  const res = await fetch(
    `https://graph.microsoft.com/v1.0/me/messages?${qs.toString()}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Impossible de récupérer la conversation Outlook (${res.status}): ${txt}`)
  }
  const data = await res.json()
  const messages: { id: string }[] = data.value || []
  if (messages.length === 0) throw new Error('Aucun message trouvé dans cette conversation')
  await Promise.all(messages.map((msg) => deleteOutlookMessage(token, msg.id)))
}

// DELETE → supprime côté provider puis en DB
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread
  const token = await getFreshToken(account)

  try {
    if (account.provider === 'google') {
      await trashGmailThread(token, account.refreshToken ?? undefined, thread.threadId)
    } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
      if (thread.messageId) {
        // On a l'ID direct du message → suppression directe
        await deleteOutlookMessage(token, thread.messageId)
      } else {
        // Anciens threads sans messageId → chercher par conversationId
        await deleteOutlookConversation(thread.threadId, token)
      }
    } else if (account.provider === 'zoho') {
      const userInfo = await getZohoUserInfo(token)
      if (!userInfo.accountId) throw new Error('Zoho accountId introuvable')
      await deleteZohoMessage(token, userInfo.accountId, thread.messageId || thread.threadId)
    }
  } catch (providerErr: any) {
    console.error('Provider delete failed:', providerErr)
    return NextResponse.json(
      { error: `Erreur provider : ${providerErr.message}` },
      { status: 502 }
    )
  }

  // Supprimer de la DB seulement si le provider a confirmé
  await (prisma as any).emailThread.delete({ where: { id: params.threadId } })
  return NextResponse.json({ success: true })
}

// PATCH → mark as read / archive
export async function PATCH(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { markRead, archive } = body

  const thread = await (prisma as any).emailThread.findUnique({
    where: { id: params.threadId },
    include: { account: true },
  })
  if (!thread) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const { account } = thread
  const token = await getFreshToken(account)

  // Marquage côté provider (non bloquant — l'état local prime)
  if (markRead) {
    try {
      if (account.provider === 'google') {
        await markGmailThreadRead(token, account.refreshToken ?? undefined, thread.threadId)
      } else if (account.provider === 'outlook' || account.provider === 'microsoft') {
        await markOutlookMessageRead(token, thread.messageId || thread.threadId)
      } else if (account.provider === 'zoho') {
        const userInfo = await getZohoUserInfo(token)
        if (userInfo.accountId && (thread.messageId || thread.threadId)) {
          await markZohoMessageRead(token, userInfo.accountId, thread.messageId || thread.threadId)
        }
      }
    } catch (e) {
      console.warn('Provider markRead failed (non-blocking):', e)
    }
  }

  const updated = await (prisma as any).emailThread.update({
    where: { id: params.threadId },
    data: {
      ...(markRead !== undefined ? { isUnread: !markRead } : {}),
      ...(archive !== undefined ? { isArchived: archive } : {}),
    },
  })
  return NextResponse.json(updated)
}
