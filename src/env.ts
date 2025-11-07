import { violet, bold, red } from "./colors";
import { logger } from "./utils/logger";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    logger.error("env.missing", { message: `The ${key} env var is required` });
    // keep the old visual warning too for very early startup clarity
    console.log(
      `${red(bold("⚠ Fatal"))}: The ${violet(key)} env var is required`,
    );
    process.exit(1);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 3000),
  portainer: {
    apiUrl: process.env.BASE_URL || requireEnv("PORTAINER_API_URL"),
    username: process.env.USERNAME || requireEnv("PORTAINER_USERNAME"),
    password: process.env.PASSWORD || requireEnv("PORTAINER_PASSWORD"),
  },
  apiKey: process.env.API_KEY || undefined,
};

export function logEnvWarnings() {
  if (env.apiKey) {
    logger.info("env.api_key", {
      message: "API_KEY set - endpoints are protected",
    });
  } else {
    logger.info("env.api_key", {
      message: "API_KEY not set - endpoints are not protected",
    });
  }

  maybeLogDeprecated("BASE_URL", "PORTAINER_API_URL");
  maybeLogDeprecated("USERNAME", "PORTAINER_USERNAME");
  maybeLogDeprecated("PASSWORD", "PORTAINER_PASSWORD");
}

function maybeLogDeprecated(key: string, replacement: string): void {
  if (process.env[key]) {
    logger.warn("env.deprecated", {
      message: `${key} is deprecated, use ${replacement} instead`,
    });
  }
}
