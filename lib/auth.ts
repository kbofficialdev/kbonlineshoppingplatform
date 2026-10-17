import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'kb_fashions_telangana_super_secret_jwt_key_2026_xyz';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  name: string;
}

// Hash password with salt
export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

// Compare password
export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

// Generate JWT token
export function signToken(payload: TokenPayload, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

// Extract auth token from request (header or cookie)
export function getAuthFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    // Check cookie
    const cookie = req.cookies.get('kb_auth_token');
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) return null;
  try {
    token = decodeURIComponent(token).replace(/^["']|["']$/g, '').trim();
  } catch (e) {}

  return verifyToken(token);
}

// Alias for getAuthFromRequest
export const verifyAuth = getAuthFromRequest;
export const getAuthUser = getAuthFromRequest;

// Generate 6-digit numeric OTP
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export { sendMail, sendOtpEmail, sendPasswordResetEmail, sendAccountLockedEmail } from './email';

// Real / Live Email Dispatcher via Nodemailer
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string }> {
  const { sendMail } = await import('./email');
  return sendMail({ to, subject, html });
}
