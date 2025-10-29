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

  if (pathname.startsWith('/jobs')) {
    if (role !== 'candidate') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/apply')) {
    if (role !== 'candidate') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname.startsWith('/thankyou')) {
    if (role !== 'candidate') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

// Tentukan path yang mau di-protect
export const config = {
  matcher: ['/dashboard/:path*', '/jobs/:path*', '/apply/:path*'],
};
