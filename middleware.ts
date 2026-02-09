import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/setup', '/', '/about', '/services', '/contact']
// List of protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/bookings', '/messages', '/reviews']
// List of API routes that require authentication
const protectedApiRoutes = ['/api/user/', '/api/bookings/', '/api/messages/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies (for server-side) or check localStorage flag
  const hasAuthCookie = request.cookies.has('auth_token')
  const hasLocalStorageFlag = request.headers.get('x-auth-flag') === 'true'
  const isAuthenticated = hasAuthCookie || hasLocalStorageFlag
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname) || publicRoutes.some(route => pathname.startsWith(route))
  
  // Handle protected routes
  if ((isProtectedRoute || isProtectedApiRoute) && !isAuthenticated) {
    // For API routes, return 401
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // For protected pages, redirect to login with return url
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Handle auth pages (login, setup) when already authenticated
  if ((pathname === '/login' || pathname === '/setup') && isAuthenticated) {
    // Check if setup is complete from cookie or header
    const isSetupComplete = request.cookies.get('setup_complete')?.value === 'true' ||
                           request.headers.get('x-setup-complete') === 'true'
    
    if (pathname === '/login') {
      // If trying to access login when authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    if (pathname === '/setup' && isSetupComplete) {
      // If trying to access setup when already completed, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - handled separately
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}