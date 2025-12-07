import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Logger } from '../utils/logger.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Authorization header missing' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, error: 'Invalid authorization format' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (err) {
    Logger.warn('JWT validation failed', err);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
