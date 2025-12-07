export class NevTokenService {
  public calculatePlatformFee(amount: number): number {
    return amount * 0.07;
  }

  public calculateCashback(amount: number): number {
    return amount * 0.01;
  }

  public calculateAmbassadorReward(amount: number): number {
    return amount * 0.03;
  }

  public freezeToStaking(amount: number): void {
    console.log(`[NevTokenService] freezing ${amount} NEV to staking pool (stub)`);
  }
}
