import express from "express";
import cors from "cors";
import { registerRoutes } from "./api/routes";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  registerRoutes(app);

  return app;
}

export const app = createServer();
