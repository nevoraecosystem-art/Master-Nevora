import express, { Application, Request, Response } from "express";
import { NorahOrchestrator } from "../core/NorahOrchestrator";

export class NorahController {
  private orchestrator: NorahOrchestrator;

  constructor(orchestrator: NorahOrchestrator) {
    this.orchestrator = orchestrator;
  }

  public register(app: Application): void {
    const router = express.Router();

    router.get("/status", (req: Request, res: Response) => {
      res.json({
        governance: !!this.orchestrator.governance,
        security: !!this.orchestrator.security,
        neural: !!this.orchestrator.neural,
        evolution: !!this.orchestrator.evolution,
        business: !!this.orchestrator.business,
        finance: !!this.orchestrator.finance,
        nle: !!this.orchestrator.nle,
      });
    });

    app.use("/api/norah", router);
  }
}
