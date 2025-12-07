import { Express, Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { UserController } from "./controllers/UserController";
import { EventsController } from "./controllers/EventsController";
import { NorahController } from "./controllers/NorahController";
import { VisionController } from "./controllers/VisionController";

export function registerRoutes(app: Express): void {
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  const authRouter = Router();
  authRouter.get("/", AuthController.login);
  authRouter.post("/login", AuthController.login);
  authRouter.post("/register", AuthController.register);
  app.use("/api/auth", authRouter);

  const usersRouter = Router();
  usersRouter.get("/", UserController.list);
  usersRouter.get("/me", UserController.getProfile);
  app.use("/api/users", usersRouter);

  const eventsRouter = Router();
  eventsRouter.get("/", EventsController.list);
  eventsRouter.post("/", EventsController.create);
  app.use("/api/events", eventsRouter);

  const norahRouter = Router();
  norahRouter.all("/", NorahController.handle);
  app.use("/api/norah", norahRouter);

  const visionRouter = Router();
  visionRouter.post("/", VisionController.analyze);
  app.use("/api/vision", visionRouter);
}
