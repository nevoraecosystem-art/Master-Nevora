import { Request, Response } from 'express';
import { NevoraEventsService } from '../../modules/nevoraEvents/NevoraEventsService';

const eventsService = new NevoraEventsService();

export class EventsController {
  async createEvent(req: Request, res: Response) {
    const user = (req as any).user;
    if (user.role !== 'PRODUCER') {
      return res.status(403).json({ error: 'Only producers can create events' });
    }

    const data = { ...req.body, producerId: user.userId, active: true };
    const event = await eventsService.createEvent(data);
    return res.json(event);
  }

  async listEvents(_req: Request, res: Response) {
    const events = await eventsService.listEvents();
    return res.json(events);
  }

  async getEvent(req: Request, res: Response) {
    const event = await eventsService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    return res.json(event);
  }

  async buyTicket(req: Request, res: Response) {
    const buyerId = (req as any).user.userId;
    const { ambassadorId } = req.body;
    try {
      const ticket = await eventsService.createTicket(req.params.id, buyerId, ambassadorId);
      return res.json(ticket);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async analytics(req: Request, res: Response) {
    const user = (req as any).user;
    const event = await eventsService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (user.userId !== event.producerId && user.role !== 'FOUNDER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const analytics = await eventsService.getEventAnalytics(req.params.id);
    return res.json(analytics);
  }
}
