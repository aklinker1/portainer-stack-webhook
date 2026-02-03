import { violet } from "./colors";
import type { Logger } from "./utils/logger";

export type LogFormat = "json" | "pretty";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`The ${violet(key)} env var is required`);
    process.exit(1);
  }
  return value;
}

function getLogFormat(): LogFormat {
  const env =
    process.env.LOG_FORMAT ??
    (process.env.NODE_ENV === "production" ? "json" : "pretty");
  if (!["json", "pretty"].includes(env)) {
    console.error(
      `The ${violet("LOG_FORMAT")} env var must be "pretty" or "json"`,
    );
    process.exit(1);
  }
  return env as LogFormat;
}

export const env = {
  port: Number(process.env.PORT || 3000),
  portainer: {
    apiUrl: process.env.BASE_URL || requireEnv("PORTAINER_API_URL"),
    username: process.env.USERNAME || requireEnv("PORTAINER_USERNAME"),
    password: process.env.PASSWORD || requireEnv("PORTAINER_PASSWORD"),
  },
  apiKey: process.env.API_KEY || undefined,
  logFormat: getLogFormat(),
};

export function logEnvWarnings(logger: Logger) {
  if (env.apiKey) {
    logger.warn(`${violet("API_KEY")} set - endpoints are protected`);
  } else {
    logger.warn(`${violet("API_KEY")} not set - endpoints are not protected`);
  }

  maybeLogDeprecated(logger, "BASE_URL", "PORTAINER_API_URL");
  maybeLogDeprecated(logger, "USERNAME", "PORTAINER_USERNAME");
  maybeLogDeprecated(logger, "PASSWORD", "PORTAINER_PASSWORD");
}

function maybeLogDeprecated(
  logger: Logger,
  key: string,
  replacement: string,
): void {
  if (process.env[key]) {
    logger.warn(
      `${violet(key)} is deprecated, use ${violet(replacement)} instead`,
    );
  }
}
