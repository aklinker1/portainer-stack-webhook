import { violet, bold, cyan, red, yellow } from "./colors";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
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
    baseUrl: process.env.BASE_URL || requireEnv("PORTAINER_BASE_URL"),
    username: process.env.USERNAME || requireEnv("PORTAINER_USERNAME"),
    password: process.env.PASSWORD || requireEnv("PORTAINER_PASSWORD"),
  },
  apiKey: process.env.API_KEY || undefined,
};

export function logEnvWarnings() {
  if (env.apiKey) {
    console.log(
      `${cyan(bold("ℹ"))} ${violet("API_KEY")} set - endpoints are protected`,
    );
  } else {
    console.log(
      `${cyan(bold("ℹ"))} ${violet("API_KEY")} not set - endpoints are not protected`,
    );
  }

  maybeLogDeprecated("BASE_URL", "PORTAINER_API_URL");
  maybeLogDeprecated("USERNAME", "PORTAINER_USERNAME");
  maybeLogDeprecated("PASSWORD", "PORTAINER_PASSWORD");
}

function maybeLogDeprecated(key: string, replacement: string): void {
  if (process.env[key]) {
    console.log(
      `${yellow(bold("⚠"))} ${violet(key)} is deprecated, use ${violet(replacement)} instead`,
    );
  }
}
