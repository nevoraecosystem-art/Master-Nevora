import { Application } from 'express';
import { AuthController } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { EventsController } from './controllers/EventsController';
import { NorahController } from './controllers/NorahController';
import { VisionController } from './controllers/VisionController';
import { authMiddleware } from '../shared/utils/auth';
import { FounderController } from '../modules/founder/FounderController';

const authController = new AuthController();
const userController = new UserController();
const eventsController = new EventsController();
const norahController = new NorahController();
const visionController = new VisionController();
const founderController = new FounderController();

export function registerRoutes(app: Application) {
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/api/auth/register', (req, res) => authController.register(req, res));
  app.post('/api/auth/login', (req, res) => authController.login(req, res));

  app.get('/api/users/me', authMiddleware, (req, res) => userController.me(req, res));
  app.get('/api/users/me/wallet', authMiddleware, (req, res) => userController.getWallet(req, res));

  app.get('/api/events', (req, res) => eventsController.listEvents(req, res));
  app.get('/api/events/:id', (req, res) => eventsController.getEvent(req, res));
  app.post('/api/events', authMiddleware, (req, res) => eventsController.createEvent(req, res));
  app.post('/api/events/:id/tickets', authMiddleware, (req, res) => eventsController.buyTicket(req, res));
  app.get('/api/events/:id/analytics', authMiddleware, (req, res) => eventsController.analytics(req, res));

  app.get('/api/norah/status', (req, res) => norahController.getStatus(req, res));
  app.post('/api/norah/lite/chat', authMiddleware, (req, res) => norahController.liteChat(req, res));

  app.post('/api/vision/frame', (req, res) => visionController.analyzeFrame(req, res));

  app.post('/api/founder/command', authMiddleware, (req, res) => founderController.command(req, res));
}
