import express, { Application, Request, Response } from "express";
import { NorahOrchestrator } from "../../core/NorahOrchestrator";
import { FounderAuthGuard } from "./FounderAuthGuard";

export class FounderCommandCenter {
  private orchestrator: NorahOrchestrator;
  private guard: FounderAuthGuard;

  constructor(orchestrator: NorahOrchestrator) {
    this.orchestrator = orchestrator;
    this.guard = new FounderAuthGuard(this.orchestrator.governance);
  }

  public register(app: Application): void {
    const router = express.Router();
    router.post(
      "/command",
      this.guard.handle,
      async (req: Request, res: Response): Promise<void> => {
        const { command, token } = req.body || {};

        if (!this.orchestrator.governance.isFounderTokenValid(token || "")) {
          res.status(403).json({ executed: false, response: "Invalid founder token" });
          return;
        }

        try {
          const response = await this.orchestrator.executeFounderCommand(command);
          res.json({ executed: true, response });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          res.status(400).json({ executed: false, response: message });
        }
      }
    );

    app.use("/api/founder", router);
  }
}
