import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = request.cookies.get('token')?.value;

  if (!token && (url.pathname === '/products/addProduct' || url.pathname.startsWith('/products/updateProduct') || url.pathname.startsWith('/products/deleteProduct'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Apply middleware to restricted routes
export const config = {
  matcher: ['/products/addProduct', '/products/updateProduct/:path*', '/products/updateProduct/:path*'],
};
