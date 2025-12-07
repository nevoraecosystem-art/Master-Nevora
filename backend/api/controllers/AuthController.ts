import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma';
import { generateToken } from '../../shared/utils/auth';
import { NevTokenService } from '../../modules/tokenomics/NevTokenService';

const tokenService = new NevTokenService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed, role },
    });

    await tokenService.getOrCreateWallet(user.id);

    const token = generateToken({ userId: user.id, role: user.role });
    return res.json({ token, user });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, role: user.role });
    return res.json({ token, user });
  }
}
