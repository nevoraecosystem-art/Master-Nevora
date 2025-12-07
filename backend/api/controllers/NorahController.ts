import { Request, Response } from 'express';
import { NorahPersonalService } from '../../modules/norahPersonal/NorahPersonalService';

const norahService = new NorahPersonalService();

export class NorahController {
  async getStatus(_req: Request, res: Response) {
    return res.json(norahService.getOrchestratorStatus());
  }

  async liteChat(req: Request, res: Response) {
    const userId = (req as any).user.userId;
    const { message } = req.body;
    const reply = await norahService.handleLiteChat(userId, message);
    return res.json({ reply });
  }
}
