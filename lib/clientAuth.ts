/**
 * KB FASHIONS Client Authentication & Session Synchronizer
 * Guarantees seamless session persistence across localStorage, document.cookie,
 * and authenticated fetch calls (Bearer token header + credentials: 'include').
 */

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('kb_auth_token');
  if (token) return token;
  // Check document.cookie fallback
  const match = document.cookie.match(/(?:^|;\s*)kb_auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('kb_user_info');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setClientSession(token: string, user: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('kb_auth_token', token);
    localStorage.setItem('kb_user_info', JSON.stringify(user));
    // Synchronize to document.cookie with 7-day validity so Next.js middleware and SSR always receive it
    const maxAge = 7 * 24 * 3600;
    document.cookie = `kb_auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `kb_session_active=1; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (e) {
    console.error('Error synchronizing client session:', e);
  }
}

export function clearClientSession() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('kb_auth_token');
    localStorage.removeItem('kb_user_info');
    document.cookie = `kb_auth_token=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `kb_session_active=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {
    console.error('Error clearing client session:', e);
  }
}

/**
 * Universal Authenticated Fetch wrapper
 * Automatically injects Authorization: Bearer <token> and credentials: 'include'
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
