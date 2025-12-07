import { NextFunction, Response } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from './authMiddleware.js';

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ success: false, error: 'Forbidden: insufficient role' });
    }

    return next();
  };
}
