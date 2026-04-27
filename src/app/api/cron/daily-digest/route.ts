import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

export const dynamic = 'force-dynamic'

const PRIORITY_ORDER = ['important', 'compta', 'events', 'veille', 'loge', 'newsletter']
const PRIORITY_LABELS: Record<string, string> = {
  important: '🔴 Important',
  compta: '💼 Comptabilité',
  events: '🗓️ Événements',
  veille: '🏥 Veille médicale',
  loge: '🤝 Loge',
  newsletter: '📧 Newsletters',
}

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/mail/connect/callback`
  )
}

function encodeEmail(to: string, subject: string, body: string): string {
  const raw = `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=utf-8\r\nMIME-Version: 1.0\r\n\r\n${body}`
  return Buffer.from(raw).toString('base64url')
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const threads = await (prisma as any).emailThread.findMany({
      where: { isUnread: true, date: { gte: since } },
      include: { account: { select: { email: true, provider: true, accessToken: true, refreshToken: true } } },
      orderBy: { date: 'desc' },
      take: 100,
    })

    if (threads.length === 0) {
      return NextResponse.json({ message: 'Aucun email non lu à signaler' })
    }

    const grouped: Record<string, typeof threads> = {}
    for (const t of threads) {
      if (!grouped[t.category]) grouped[t.category] = []
      grouped[t.category].push(t)
    }

    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    let html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:24px;border-radius:12px 12px 0 0;">
<h1 style="color:white;margin:0;font-size:22px;">📬 Digest Tarandro Mail</h1>
<p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">${today} — ${threads.length} email${threads.length > 1 ? 's' : ''} à traiter</p>
</div>
<div style="background:#f9fafb;padding:20px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;">`

    for (const category of PRIORITY_ORDER) {
      const items = grouped[category]
      if (!items?.length) continue
      html += `<div style="margin-bottom:20px;"><h2 style="font-size:15px;font-weight:700;color:#374151;margin:0 0 10px;padding:8px 12px;background:white;border-radius:8px;border-left:4px solid #6366f1;">${PRIORITY_LABELS[category]} (${items.length})</h2><div style="background:white;border-radius:8px;border:1px solid #e5e7eb;">`
      for (const thread of items.slice(0, 5)) {
        const senderName = thread.sender.match(/^(.+?)\s*</)?.[1]?.replace(/"/g, '') || thread.sender
        const dateStr = new Date(thread.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        html += `<div style="padding:12px 16px;border-bottom:1px solid #f3f4f6;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13px;">${senderName}</strong><span style="font-size:12px;color:#9ca3af;">${dateStr}</span></div><p style="margin:2px 0;font-size:13px;font-weight:600;color:#374151;">${thread.subject}</p><p style="margin:0;font-size:12px;color:#6b7280;">${thread.snippet.substring(0, 100)}</p></div>`
      }
      if (items.length > 5) html += `<div style="padding:8px 16px;font-size:12px;color:#6b7280;text-align:center;">... et ${items.length - 5} autre${items.length - 5 > 1 ? 's' : ''}</div>`
      html += `</div></div>`
    }
    html += `<div style="text-align:center;margin-top:16px;"><a href="${process.env.NEXTAUTH_URL}/mail" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Ouvrir la boîte mail →</a></div></div></div>`

    const gmailAccount = await (prisma as any).emailAccount.findFirst({ where: { provider: 'google' } })
    if (!gmailAccount) {
      return NextResponse.json({ message: 'Digest généré mais aucun compte Gmail pour envoyer', threadCount: threads.length })
    }

    const client = getOAuth2Client()
    client.setCredentials({ access_token: gmailAccount.accessToken, refresh_token: gmailAccount.refreshToken })
    const gmail = google.gmail({ version: 'v1', auth: client })
    const raw = encodeEmail(gmailAccount.email, `📬 Digest Tarandro — ${threads.length} email${threads.length > 1 ? 's' : ''} à traiter`, html)
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })

    return NextResponse.json({ success: true, sent: true, count: threads.length, to: gmailAccount.email })
  } catch (err) {
    console.error('Daily digest error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
