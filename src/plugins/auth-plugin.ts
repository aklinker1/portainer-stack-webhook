import { createApp, UnauthorizedHttpError } from "@aklinker1/zeta";
import { env } from "../env";
import { logger } from "../utils/logger";

export const authPlugin = createApp()
  .onTransform(({ request }) => {
    // Allow unauthenticated requests if no API key is provided
    if (!env.apiKey) return;

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      logger.warn("auth.missing_api_key", {
        method: request.method,
        path: new URL(request.url).pathname,
        client:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip"),
      });
      throw new UnauthorizedHttpError("X-API-Key header is required");
    }
    if (apiKey !== env.apiKey) {
      logger.warn("auth.invalid_api_key", {
        method: request.method,
        path: new URL(request.url).pathname,
      });
      throw new UnauthorizedHttpError("Invalid API key");
    }
  })
  .export();
