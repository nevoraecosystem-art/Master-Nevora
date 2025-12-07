import { Request, Response } from "express";

export class AuthController {
  static async login(req: Request, res: Response) {
    return res.json({ message: "AuthController.login placeholder" });
  }

  static async register(req: Request, res: Response) {
    return res.json({ message: "AuthController.register placeholder" });
  }
}
