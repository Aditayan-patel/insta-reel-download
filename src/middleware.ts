import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Redirect www to non-www
  if (hostname.startsWith('www.')) {
    const newUrl = new URL(url.pathname, `https://${hostname.replace('www.', '')}`);
    newUrl.search = url.search;
    return NextResponse.redirect(newUrl, 301);
  }
  
  // Redirect HTTP to HTTPS (Vercel handles this automatically usually)
  if (process.env.NODE_ENV === 'production' && !url.protocol.includes('https')) {
    const newUrl = new URL(url.pathname, `https://${hostname}`);
    newUrl.search = url.search;
    return NextResponse.redirect(newUrl, 301);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};