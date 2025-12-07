import { Request, Response } from "express";

export class VisionController {
  static async analyze(req: Request, res: Response) {
    return res.json({ message: "VisionController.analyze placeholder" });
  }
}
