import { NextFunction, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import prisma from '../utils/prisma.js';
import { config } from '../config/env.js';
import { Logger } from '../utils/logger.js';

const router = Router();

const founderAuthGuard = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers['x-founder-token'];
  if (token !== `SOU FUNDADOR ${config.founderToken}`) {
    return res.status(401).json({ success: false, error: 'Founder token missing or invalid' });
  }
  return next();
};

router.post('/api/auth/register', rateLimiter, async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userRole = role && Object.values(UserRole).includes(role) ? (role as UserRole) : UserRole.CLIENT;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name ?? email.split('@')[0],
        role: userRole,
        wallet: {
          create: { balanceNEV: 0 },
        },
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    return res.json({ success: true, data: { token, user } });
  } catch (error) {
    return next(error);
  }
});

router.post('/api/auth/login', rateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
    return res.json({ success: true, data: { token, user } });
  } catch (error) {
    return next(error);
  }
});

router.get('/api/users/me', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { wallet: true } });
    return res.json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
});

router.get('/api/users/me/wallet', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.id }, include: { transactions: true } });
    return res.json({ success: true, data: wallet });
  } catch (error) {
    return next(error);
  }
});

router.use('/api/events', authMiddleware);

router.get('/api/events', async (_req, res, next) => {
  try {
    const events = await prisma.event.findMany({ include: { producer: true, analytics: true } });
    return res.json({ success: true, data: events });
  } catch (error) {
    return next(error);
  }
});

router.post('/api/events', requireRole(UserRole.PRODUCER, UserRole.FOUNDER), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, description, basePrice } = req.body;
    const event = await prisma.event.create({
      data: {
        title,
        description,
        basePrice,
        producerId: req.user!.id,
        analytics: { create: {} },
      },
    });
    return res.status(201).json({ success: true, data: event });
  } catch (error) {
    return next(error);
  }
});

router.get('/api/events/:id', async (req, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: { analytics: true, producer: true } });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    return res.json({ success: true, data: event });
  } catch (error) {
    return next(error);
  }
});

router.post('/api/events/:id/buy', async (req: AuthenticatedRequest, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: { analytics: true } });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    const totalPrice = Number(event.basePrice) * (1 + config.nevEventFee);

    const ticket = await prisma.ticket.create({
      data: {
        eventId: event.id,
        buyerId: req.user!.id,
        pricePaid: totalPrice,
      },
    });

    await prisma.eventAnalytics.update({
      where: { eventId: event.id },
      data: {
        ticketsSold: { increment: 1 },
        revenue: { increment: totalPrice },
      },
    });

    return res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    return next(error);
  }
});

router.get('/api/events/:id/analytics', requireRole(UserRole.PRODUCER, UserRole.FOUNDER), async (req: AuthenticatedRequest, res, next) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id }, include: { analytics: true } });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    if (req.user!.role !== UserRole.FOUNDER && event.producerId !== req.user!.id) {
      return res.status(403).json({ success: false, error: 'Forbidden: analytics restricted to producer or founder' });
    }

    return res.json({ success: true, data: event.analytics });
  } catch (error) {
    return next(error);
  }
});

router.post('/api/norah/lite/chat', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { prompt } = req.body;
    const response = `Norah lite reply to ${req.user?.id}: ${prompt ?? 'Hello!'}`;
    return res.json({ success: true, data: { response } });
  } catch (error) {
    return next(error);
  }
});

router.post('/api/founder/command', rateLimiter, founderAuthGuard, async (req, res, next) => {
  try {
    const { command } = req.body;
    Logger.info('Founder command received', command);
    return res.json({ success: true, data: { accepted: true, command } });
  } catch (error) {
    return next(error);
  }
});

router.post('/api/vision/frame', rateLimiter, async (req, res, next) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 is required' });
    }
    const placeholder = 'Vision core placeholder response. Future headset stream will be analyzed here.';
    return res.json({ success: true, data: { summary: placeholder, received: imageBase64.slice(0, 32) } });
  } catch (error) {
    return next(error);
  }
});

export default router;
