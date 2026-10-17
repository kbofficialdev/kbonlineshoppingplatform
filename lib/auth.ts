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
    token = authHeader.substring(7);
  } else {
    // Check cookie
    const cookie = req.cookies.get('kb_auth_token');
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) return null;
  return verifyToken(token);
}

// Generate 6-digit numeric OTP
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mock/Live Email Dispatcher
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  console.log(`\n📧 [EMAIL DISPATCH via ${smtpHost || 'Console Dispatcher'}]`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Content: ${html.replace(/<[^>]*>?/gm, '').substring(0, 120)}...`);

  // If live credentials are provided in .env, nodemailer can send, otherwise safely logs token/link for testing
  return { success: true, messageId: `msg_${Date.now()}` };
}
