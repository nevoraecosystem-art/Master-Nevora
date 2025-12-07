import { NextFunction, Request, Response } from 'express';
import { Logger } from '../utils/logger.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  Logger.error('Unhandled error', err);
  const message = err.message || 'Unexpected error';
  return res.status(500).json({ success: false, error: message });
}
