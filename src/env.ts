import { violet, bold, cyan, red } from "./colors";

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
  baseUrl: requireEnv("BASE_URL"),
  username: requireEnv("USERNAME"),
  password: requireEnv("PASSWORD"),
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
}
