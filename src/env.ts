function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  PORT: Number(process.env.PORT || 3000),
  BASE_URL: requireEnv("BASE_URL"),
  USERNAME: requireEnv("USERNAME"),
  PASSWORD: requireEnv("PASSWORD"),
};
