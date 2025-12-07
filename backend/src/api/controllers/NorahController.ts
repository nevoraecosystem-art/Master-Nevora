import { Request, Response } from "express";

export class NorahController {
  static async handle(req: Request, res: Response) {
    return res.json({ message: "NorahController.handle placeholder" });
  }
}
