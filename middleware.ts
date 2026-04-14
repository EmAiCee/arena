import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define admin emails
const ADMIN_EMAILS = ['algonimusa202@gmail.com'];

export async function middleware(request: NextRequest) {
  // Check if trying to access admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      const email = payload.email as string;
      if (!ADMIN_EMAILS.includes(email)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};