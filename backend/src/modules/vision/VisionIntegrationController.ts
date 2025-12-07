import express, { Application, Request, Response } from "express";
import { VisionFrame, VisionObject, VisionTextBlock } from "./VisionDeviceContracts";

export class VisionIntegrationController {
  public register(app: Application): void {
    const router = express.Router();

    router.post("/frame", (req: Request, res: Response) => {
      const frame = req.body as VisionFrame;
      const objects: VisionObject[] = [
        { label: "device", confidence: 0.82 },
        { label: "interface", confidence: 0.64 },
      ];
      const text: VisionTextBlock[] = [
        { text: "NEV", position: "center" },
        { text: "Norah", position: "bottom" },
      ];
      const insights = "Frame processed with placeholder detections.";

      res.json({
        received: Boolean(frame?.base64),
        textoDetectado: text,
        objetos: objects,
        insights,
      });
    });

    app.use("/api/vision", router);
  }
}
