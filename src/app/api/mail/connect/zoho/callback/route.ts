import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { exchangeZohoCodeForTokens, getZohoUserInfo } from '@/lib/zoho'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXTAUTH_URL))
  }

  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDesc = searchParams.get('error_description') || ''

  if (error || !code) {
    const msg = encodeURIComponent(error || 'no_code')
    return NextResponse.redirect(
      new URL(`/mail/settings?error=${msg}`, process.env.NEXTAUTH_URL)
    )
  }

  try {
    // Échange du code contre les tokens
    const tokens = await exchangeZohoCodeForTokens(code)

    if (!tokens.access_token) {
      const detail = encodeURIComponent(`token_missing: ${JSON.stringify(tokens)}`)
      return NextResponse.redirect(
        new URL(`/mail/settings?error=${detail}`, process.env.NEXTAUTH_URL)
      )
    }

    // Récupérer les infos du compte
    const userInfo = await getZohoUserInfo(tokens.access_token)

    if (!userInfo.email) {
      return NextResponse.redirect(
        new URL('/mail/settings?error=zoho_no_email', process.env.NEXTAUTH_URL)
      )
    }

    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null

    await (prisma as any).emailAccount.upsert({
      where: { provider_email: { provider: 'zoho', email: userInfo.email } },
      create: {
        provider: 'zoho',
        email: userInfo.email,
        displayName: userInfo.displayName || userInfo.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt,
      },
      update: {
        displayName: userInfo.displayName || userInfo.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt,
      },
    })

    return NextResponse.redirect(
      new URL('/mail/settings?success=zoho_connected', process.env.NEXTAUTH_URL)
    )
  } catch (err: any) {
    console.error('Zoho callback error:', err)
    const detail = encodeURIComponent(err?.message || 'unknown')
    return NextResponse.redirect(
      new URL(`/mail/settings?error=${detail}`, process.env.NEXTAUTH_URL)
    )
  }
}
