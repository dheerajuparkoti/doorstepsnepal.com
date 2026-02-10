import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { User } from '@/lib/data/user' 
import { checkIfUserNeedsSetup } from '@/lib/utils/auth-helpers'
// List of public routes that don't require authentication
const publicRoutes = ['/login', '/setup', '/', '/about', '/services', '/contact']
// List of protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/bookings', '/messages', '/reviews']
// List of API routes that require authentication
const protectedApiRoutes = ['/api/user/', '/api/bookings/', '/api/messages/']


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get token from cookies (for server-side) or check localStorage flag
  const hasAuthCookie = request.cookies.has('auth_token')
  const hasLocalStorageFlag = request.headers.get('x-auth-flag') === 'true'
  const isAuthenticated = hasAuthCookie || hasLocalStorageFlag
  
  // Get user data from cookies
  const userCookie = request.cookies.get('user_data')?.value
  let userData: Partial<User> | null = null
  if (userCookie) {
    try {
      userData = JSON.parse(userCookie)
    } catch (e) {
      console.error('Error parsing user cookie:', e)
    }
  }
  
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route))
  
  // Handle protected routes for unauthenticated users
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
  
  // Handle authenticated user routing
  if (isAuthenticated) {
  
    // Check if user needs setup based on actual user data
    let needsSetup = false;
    
    if (userData) {
      // Use the actual check function with user data
      needsSetup = checkIfUserNeedsSetup(userData);
    } else {
      // If no user data, check the setup_complete cookie as fallback
      const isSetupCompleteFromCookie = request.cookies.get('setup_complete')?.value === 'true'
      const isSetupCompleteFromHeader = request.headers.get('x-setup-complete') === 'true'
      const isSetupComplete = isSetupCompleteFromCookie || isSetupCompleteFromHeader
      needsSetup = !isSetupComplete;
    }

    
    // Handle login page when authenticated
    if (pathname === '/login') {
      const redirectUrl = needsSetup ? '/setup' : '/dashboard'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    
    // Handle setup page
    if (pathname === '/setup') {
      if (!needsSetup) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Allow access to setup page if needed
    }
    
    // Handle protected pages when user needs setup
    if (isProtectedRoute && needsSetup && pathname !== '/setup') {
      return NextResponse.redirect(new URL('/setup', request.url))
    }
    
    // Allow access to protected routes if no setup needed
    if (isProtectedRoute && !needsSetup) {
   
      // The code continues...
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