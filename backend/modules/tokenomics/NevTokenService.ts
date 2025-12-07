import { prisma } from '../../shared/prisma';

type TransactionType = 'CREDIT' | 'DEBIT';

export class NevTokenService {
  async getOrCreateWallet(userId: string) {
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, balanceNEV: 0 },
      });
    }
    return wallet;
  }

  async creditNEV(userId: string, amount: number, reason: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceNEV: { increment: amount } },
    });

    await this.createTransaction(userId, amount, 'CREDIT', reason);
    return updated;
  }

  async debitNEV(userId: string, amount: number, reason: string) {
    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.balanceNEV < amount) {
      throw new Error('Insufficient NEV balance');
    }

    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balanceNEV: { decrement: amount } },
    });

    await this.createTransaction(userId, amount, 'DEBIT', reason);
    return updated;
  }

  async getUserBalance(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.balanceNEV;
  }

  private async createTransaction(userId: string, amount: number, type: TransactionType, reason: string) {
    await prisma.transaction.create({
      data: {
        userId,
        amount,
        type,
        reason,
      },
    });
  }
}
