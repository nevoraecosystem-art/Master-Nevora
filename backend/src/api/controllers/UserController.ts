import { Request, Response } from "express";

export class UserController {
  static async list(req: Request, res: Response) {
    return res.json({ message: "UserController.list placeholder" });
  }

  static async getProfile(req: Request, res: Response) {
    return res.json({ message: "UserController.getProfile placeholder" });
  }
}
