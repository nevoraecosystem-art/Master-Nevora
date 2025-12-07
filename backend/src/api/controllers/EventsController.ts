import { Request, Response } from "express";

export class EventsController {
  static async list(req: Request, res: Response) {
    return res.json({ message: "EventsController.list placeholder" });
  }

  static async create(req: Request, res: Response) {
    return res.json({ message: "EventsController.create placeholder" });
  }
}
