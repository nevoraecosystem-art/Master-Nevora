import { Request, Response, NextFunction } from "express";
import { GovernanceCore } from "../../core/GovernanceCore";

export class FounderAuthGuard {
  private governance: GovernanceCore;

  constructor(governance: GovernanceCore) {
    this.governance = governance;
  }

  public handle = (req: Request, res: Response, next: NextFunction): void => {
    const token = (req.headers["x-founder-token"] as string) || "";
    if (!this.governance.isFounderTokenValid(token)) {
      res.status(403).json({ message: "Founder authentication required" });
      return;
    }
    next();
  };
}
