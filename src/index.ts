import { version } from "./version";
import { app } from "./app";
import { env, logEnvWarnings } from "./env";
import { logger } from "./utils/logger";

logger.info("startup", { message: "Portainer Stack Webhooks starting", version });

app.listen(env.port, () => {
  logEnvWarnings();

  logger.info("server.started", { url: `http://localhost:${env.port}` });
});

// Global process handlers for consistent logging
process.on("uncaughtException", (err: unknown) => {
  try {
    logger.error("uncaughtException", { error: String(err) });
  } catch {
    // If logger itself fails, fallback to console
    console.error("uncaughtException", err);
  }
  // allow orchestrator to restart
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  try {
    logger.error("unhandledRejection", { reason: String(reason) });
  } catch {
    console.error("unhandledRejection", reason);
  }
  // give process a chance to exit in a known state
  process.exit(1);
});

// Graceful-ish shutdown on signals
const handleSignal = (sig: string) => {
  logger.info("process.signal", { signal: sig });
  // best-effort: exit cleanly
  process.exit(0);
};

process.on("SIGINT", () => handleSignal("SIGINT"));
process.on("SIGTERM", () => handleSignal("SIGTERM"));
