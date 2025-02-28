import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session }, error
  } = await supabase.auth.getSession()
  // if (error) {
  //   // const { error, data } = await supabase.auth.refreshSession();
  //   return ;
  // }
  // OPTIONAL: this forces users to be logged in to use the chatbot.
  // If you want to allow anonymous users, simply remove the check below.
  // if (
  //   !session &&
  //   !req.url.includes('/sign-in') &&
  //   !req.url.includes('/sign-up') &&
  //   !req.url.includes('/home')
  // ) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/home'
  //   // redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  //   return NextResponse.redirect(redirectUrl)
  // }
  // console.log();
  if (
    !session &&
    ( req.url.includes('/chat') || req.url.slice(-1)=='/')
  ) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/home'
    // redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - share (publicly shared chats)
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!share|api|_next/static|_next/image|favicon.ico).*)'
  ]
}
