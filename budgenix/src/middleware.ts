import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Since we can't access localStorage in middleware (server-side),
// we need to create a client-side protection component instead.
// This middleware will just handle redirects for auth pages.
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // For protected routes, we'll handle authentication in a client component
  // This middleware will only handle redirecting logged-in users away from auth pages

  // Check if there's an authorization header (for API routes)
  const authHeader = request.headers.get('authorization')
  const hasAuthHeader = authHeader && authHeader.startsWith('Bearer ')

  // For API routes that require authentication
  if (path.startsWith('/api/dashboard') && !hasAuthHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Match API routes that need protection
    '/api/dashboard/:path*',
  ],
}
