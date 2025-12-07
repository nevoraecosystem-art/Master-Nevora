import express from 'express';
import cors from 'cors';
import router from './api/routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Logger } from './utils/logger.js';
import { config } from './config/env.js';
import { Orchestrator } from './core/orchestrator.js';

const app = express();
const orchestrator = new Orchestrator();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(router);
app.use(errorHandler);

orchestrator
  .start()
  .then(() => {
    app.listen(config.port, () => Logger.info(`Server running on port ${config.port}`));
  })
  .catch((err) => {
    Logger.error('Failed to start orchestrator', err);
    process.exit(1);
  });

export default app;
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
