import { violet, bold, red } from "./colors";
import { logger } from "./utils/logger";

function fatalEnv(message: string): never {
  logger.error("env.missing", { message });
  // keep the old visual warning too for very early startup clarity
  console.log(`${red(bold("⚠ Fatal"))}: ${message}`);
  process.exit(1);
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) fatalEnv(`The ${violet(key)} env var is required`);
  return value;
}

const portainerApiUrl =
  process.env.BASE_URL || requireEnv("PORTAINER_API_URL");
const portainerAccessToken = process.env.PORTAINER_ACCESS_TOKEN;
const portainerUsername =
  process.env.USERNAME || process.env.PORTAINER_USERNAME;
const portainerPassword =
  process.env.PASSWORD || process.env.PORTAINER_PASSWORD;

  if (!portainerAccessToken && (!portainerUsername || !portainerPassword)) {
    fatalEnv(
      "Set PORTAINER_ACCESS_TOKEN or both PORTAINER_USERNAME and PORTAINER_PASSWORD",
    );
  }

export const env = {
  port: Number(process.env.PORT || 3000),
  portainer: {
    apiUrl: portainerApiUrl,
    accessToken: portainerAccessToken,
    username: portainerUsername,
    password: portainerPassword,
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

  if (env.portainer.accessToken) {
    logger.info("env.portainer_auth", {
      message: "Using PORTAINER_ACCESS_TOKEN; username/password not required",
    });
    if (env.portainer.username || env.portainer.password) {
      logger.warn("env.portainer_auth", {
        message:
          "PORTAINER_USERNAME or PORTAINER_PASSWORD set but ignored because PORTAINER_ACCESS_TOKEN is configured",
      });
    }
  } else {
    logger.info("env.portainer_auth", {
      message: "Using PORTAINER_USERNAME and PORTAINER_PASSWORD",
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
