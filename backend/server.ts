import { app } from "./src/app";
import { env } from "./src/config/env";
import { logger } from "./src/config/logger";

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Backend running");
});

