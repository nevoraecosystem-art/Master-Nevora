import { Request, Response } from 'express';
import { prisma } from '../../shared/prisma';
import { NevTokenService } from '../../modules/tokenomics/NevTokenService';

const tokenService = new NevTokenService();

export class UserController {
  async me(req: Request, res: Response) {
    const user = await prisma.user.findUnique({ where: { id: (req as any).user.userId } });
    return res.json(user);
  }

  async getWallet(req: Request, res: Response) {
    const balance = await tokenService.getUserBalance((req as any).user.userId);
    return res.json({ balance });
  }
}
