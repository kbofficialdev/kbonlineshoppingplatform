import { NextRequest, NextResponse } from 'next/server';

function decodeJwtPayload(token: string): { role?: string; email?: string; exp?: number; userId?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null; // Token expired
    }
    return decoded;
  } catch (e) {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get('kb_auth_token');
  const token = tokenCookie?.value;
  const payload = token ? decodeJwtPayload(token) : null;

  // 1. Protect Admin Pages (/admin and /admin/*)
  if (pathname.startsWith('/admin')) {
    if (!token || !payload) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'admin_required');
      return NextResponse.redirect(signinUrl);
    }

    if (payload.role !== 'ADMIN') {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'forbidden');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 2. Protect Admin APIs (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    if (!token || !payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Valid Administrator session required' },
        { status: 401 }
      );
    }
  }

  // 3. Protect Customer Account Pages (/account and /account/*)
  if (pathname.startsWith('/account')) {
    if (!token || !payload) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'auth_required');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 4. Protect Checkout Pages (/checkout and /checkout/*)
  if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
    if (!token || !payload) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'auth_required');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 5. Protect Shopping Bag / Cart Pages (/cart and /cart/*) — Zero Anonymous Sessions
  if (pathname === '/cart' || pathname.startsWith('/cart/')) {
    if (!token || !payload) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'auth_required');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 6. Protect Wishlist Pages (/wishlist and /wishlist/*) — Valid Customer Session Required
  if (pathname === '/wishlist' || pathname.startsWith('/wishlist/')) {
    if (!token || !payload) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'auth_required');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 7. Protect Order Tracking & Invoice Pages (/orders/*, /invoices/*)
  if (pathname.startsWith('/orders') || pathname.startsWith('/invoices')) {
    if (!token || !payload) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('redirect', pathname);
      signinUrl.searchParams.set('reason', 'auth_required');
      return NextResponse.redirect(signinUrl);
    }
  }

  // 8. Protect Order Placement & Cart Mutation APIs
  if (pathname.startsWith('/api/orders') || pathname.startsWith('/api/cart')) {
    if (!token || !payload) {
      return NextResponse.json(
        { error: 'Authentication Required: Valid customer session required. Anonymous sessions are strictly prohibited.', requiresAuth: true },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout',
    '/checkout/:path*',
    '/cart',
    '/cart/:path*',
    '/wishlist',
    '/wishlist/:path*',
    '/orders/:path*',
    '/invoices/:path*',
    '/api/admin/:path*',
    '/api/orders/:path*',
    '/api/cart/:path*',
  ],
};

