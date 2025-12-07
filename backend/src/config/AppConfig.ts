export interface AppConfig {
  port: number;
  env: string;
}

const port = parseInt(process.env.PORT || "", 10);

export const config: AppConfig = {
  port: Number.isNaN(port) ? 3000 : port,
  env: process.env.NODE_ENV || "development",
};
