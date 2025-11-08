// lib/auth.ts
import { cookies } from 'next/headers';

/**
 * Change this to match your auth setup.
 * - If you use NextAuth, look for cookies like:
 *   'next-auth.session-token' (localhost) or '__Secure-next-auth.session-token' (HTTPS)
 * - For Clerk/Supabase/Custom JWT, replace accordingly.
 */
export const AUTH_COOKIE = 'ew_session';

export function isLoggedIn(): boolean {
  return Boolean(cookies().get(AUTH_COOKIE)?.value);
}
