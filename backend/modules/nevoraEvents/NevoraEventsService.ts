import { prisma } from '../../shared/prisma';
import {
  calculateAmbassadorCommission,
  calculateCashback,
  calculatePlatformFee,
  calculateProducerNetAmount,
} from './NevoraEventsPricing';
import { NevTokenService } from '../tokenomics/NevTokenService';

export class NevoraEventsService {
  private tokenService = new NevTokenService();

  async createEvent(data: any) {
    return prisma.event.create({ data });
  }

  async listEvents() {
    return prisma.event.findMany({ where: { active: true } });
  }

  async getEventById(id: string) {
    return prisma.event.findUnique({ where: { id } });
  }

  async createTicket(eventId: string, buyerId: string, ambassadorId?: string) {
    const event = await this.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const ticketPrice = event.basePrice;
    const platformFee = calculatePlatformFee(ticketPrice);
    const ambassadorCommission = ambassadorId
      ? calculateAmbassadorCommission(ticketPrice, event.ambassadorCommissionRate || 0)
      : 0;
    const cashback = calculateCashback(ticketPrice);
    const producerNet = calculateProducerNetAmount(ticketPrice, platformFee, ambassadorCommission);

    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        buyerId,
        ambassadorId: ambassadorId || null,
        pricePaid: ticketPrice,
        platformFee,
        ambassadorCommission,
        cashback,
      },
    });

    await this.recordFinancials(event.producerId, buyerId, ambassadorId, {
      platformFee,
      ambassadorCommission,
      producerNet,
      cashback,
    });

    return ticket;
  }

  async getEventAnalytics(eventId: string) {
    const tickets = await prisma.ticket.findMany({ where: { eventId } });
    const totalSold = tickets.length;
    const revenue = tickets.reduce((acc, t) => acc + (t.pricePaid || 0), 0);
    const commissions = tickets.reduce((acc, t) => acc + (t.ambassadorCommission || 0), 0);
    return { ticketsSold: totalSold, revenue, commissions };
  }

  private async recordFinancials(
    producerId: string,
    buyerId: string,
    ambassadorId: string | undefined,
    amounts: { platformFee: number; ambassadorCommission: number; producerNet: number; cashback: number }
  ) {
    await prisma.transaction.create({
      data: {
        userId: producerId,
        amount: amounts.producerNet,
        type: 'CREDIT',
        reason: 'Ticket sale net revenue',
      },
    });

    if (ambassadorId && amounts.ambassadorCommission > 0) {
      await new NevTokenService().creditNEV(ambassadorId, amounts.ambassadorCommission, 'Ambassador commission');
    }

    if (amounts.cashback > 0) {
      await this.tokenService.creditNEV(buyerId, amounts.cashback, 'Event cashback');
    }
  }
}
