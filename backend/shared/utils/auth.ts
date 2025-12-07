import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function generateToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const [, token] = header.split(' ');
  if (!token) {
    return res.status(401).json({ error: 'Invalid Authorization header' });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
