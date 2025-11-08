import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./lib/auth"

// List of paths that require authentication
const protectedPaths = [
  '/profile',
  '/admin',
  '/c/[slug]/create-post',
  '/post'
]

// List of paths that are public (don't need auth check)
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/search'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip auth check for static files and API routes
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Check for public paths
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))
  
  // Check for protected paths
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // Special handling for community pages - require auth
  const isCommunityPage = pathname.startsWith('/c/') && pathname.split('/').length === 3
  
  if (isCommunityPage || (!isPublicPath && isProtectedPath)) {
    const session = await auth()
    
    if (!session?.user?.id) {
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}