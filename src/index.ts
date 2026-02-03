import { app } from "./app";
import { bold, cyan, dim, violet } from "./colors";
import { env, logEnvWarnings } from "./env";
import { appLogger, createLogger } from "./utils/logger";
import { version } from "./version";

appLogger.info(
  `${bold(cyan("Portainer Stack Webhooks"))} ${dim("v" + version)}`,
);

app.listen(env.port, () => {
  logEnvWarnings(createLogger("env"));

  appLogger.info(
    `Server started ${dim("→")} ${violet("http://localhost:" + env.port)}`,
  );
});
