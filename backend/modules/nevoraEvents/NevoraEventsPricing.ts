const DEFAULT_PLATFORM_FEE_RATE = 0.07;
const DEFAULT_CASHBACK_RATE = 0.01;

export function calculatePlatformFee(amount: number): number {
  return amount * DEFAULT_PLATFORM_FEE_RATE;
}

export function calculateAmbassadorCommission(amount: number, commissionRate: number): number {
  return amount * commissionRate;
}

export function calculateCashback(amount: number): number {
  return amount * DEFAULT_CASHBACK_RATE;
}

export function calculateProducerNetAmount(
  ticketPrice: number,
  platformFee: number,
  ambassadorCommission: number
): number {
  return ticketPrice - platformFee - ambassadorCommission;
}
