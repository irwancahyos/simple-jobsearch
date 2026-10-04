import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Role-based protection
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const role = req.cookies.get('role')?.value;

  // Pages protection
  if (pathname.startsWith('/dashboard')) {
    if (role !== 'recruiter') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/apply') || pathname.startsWith('/thankyou')) {
    if (role !== 'candidate') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('returnTo', `${pathname}${req.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Tentukan path yang mau di-protect
export const config = {
  matcher: ['/dashboard/:path*', '/apply/:path*', '/thankyou/:path*'],
};
