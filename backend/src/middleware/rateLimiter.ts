import { NextFunction, Request, Response } from 'express';

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const ipStore = new Map<string, { count: number; start: number }>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = (req.ip || req.connection.remoteAddress || 'unknown').toString();
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry) {
    ipStore.set(ip, { count: 1, start: now });
    return next();
  }

  if (now - entry.start > WINDOW_MS) {
    ipStore.set(ip, { count: 1, start: now });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please slow down.' });
  }

  entry.count += 1;
  ipStore.set(ip, entry);
  return next();
}
