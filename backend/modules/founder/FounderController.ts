import { Request, Response } from 'express';

export class FounderController {
  async command(req: Request, res: Response) {
    // Placeholder for founder commands.
    return res.json({ received: req.body, status: 'command accepted (stub)' });
  }
}
