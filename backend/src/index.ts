import { loadEnv } from "./config/EnvLoader";
import { config } from "./config/AppConfig";
import { Logger } from "./shared/utils/Logger";
import { createServer } from "./server";

loadEnv();

const app = createServer();

app.listen(config.port, () => {
  Logger.info(`Server listening on port ${config.port} in ${config.env} mode`);
});
