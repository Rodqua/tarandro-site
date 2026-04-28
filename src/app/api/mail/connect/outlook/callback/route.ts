import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { exchangeOutlookCodeForTokens, getOutlookUserInfo } from '@/lib/outlook'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXTAUTH_URL))
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/mail/settings?error=${error || 'no_code'}`, process.env.NEXTAUTH_URL)
    )
  }

  try {
    const tokens = await exchangeOutlookCodeForTokens(code)
    const userInfo = await getOutlookUserInfo(tokens.access_token)

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null

    await prisma.emailAccount.upsert({
      where: { provider_email: { provider: 'outlook', email: userInfo.email } },
      create: {
        provider: 'outlook',
        email: userInfo.email,
        displayName: userInfo.displayName,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt,
      },
      update: {
        displayName: userInfo.displayName,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt,
      },
    })

    return NextResponse.redirect(
      new URL('/mail/settings?success=outlook_connected', process.env.NEXTAUTH_URL)
    )
  } catch (err) {
    console.error('Outlook callback error:', err)
    return NextResponse.redirect(
      new URL('/mail/settings?error=outlook_callback_failed', process.env.NEXTAUTH_URL)
    )
  }
}
