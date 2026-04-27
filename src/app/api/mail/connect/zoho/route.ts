import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getZohoAuthUrl } from '@/lib/zoho'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXTAUTH_URL))
  }
  const url = getZohoAuthUrl()
  return NextResponse.redirect(url)
}
