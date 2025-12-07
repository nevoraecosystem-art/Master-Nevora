import dotenv from "dotenv";
import { Logger } from "../shared/utils/Logger";

let loaded = false;

export function loadEnv(): void {
  if (loaded) return;
  dotenv.config();
  loaded = true;

  if (!process.env.DATABASE_URL) {
    Logger.error("DATABASE_URL is not set. Prisma may fail to connect.");
  }

  if (!process.env.OPENAI_API_KEY) {
    Logger.warn("OPENAI_API_KEY is not set. Some features may not work.");
  }
}
