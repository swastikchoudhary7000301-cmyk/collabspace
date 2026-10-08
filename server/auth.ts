import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { User } from '../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'collabspace-production-signing-secret-2026';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export function extractToken(req: Request): string | null {
  // Check authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check HTTP-only cookie: collabspace_token
  if (req.cookies && req.cookies.collabspace_token) {
    return req.cookies.collabspace_token;
  }

  return null;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  const user = db.getUserById(decoded.userId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
  }

  const { passwordHash: _, ...safeUser } = user;
  req.user = safeUser;
  next();
}

export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = db.getUserById(decoded.userId);
      if (user) {
        const { passwordHash: _, ...safeUser } = user;
        req.user = safeUser;
      }
    }
  }

  // Fallback to first user (e.g. Swastik) if demo session
  if (!req.user) {
    const defaultUser = db.getAllUsers()[0];
    if (defaultUser) {
      req.user = defaultUser;
    }
  }

  next();
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('collabspace_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie('collabspace_token', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}
