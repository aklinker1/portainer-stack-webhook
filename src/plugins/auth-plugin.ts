import { createApp, UnauthorizedHttpError } from "@aklinker1/zeta";
import { env } from "../env";
import { logger } from "../utils/logger";

export const authPlugin = createApp()
  .onTransform(({ request }) => {
    // Allow unauthenticated requests if no API key is provided
    if (!env.apiKey) return;

    const method = request.method;
    const path = new URL(request.url).pathname;
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      logger.warn("auth.missing_api_key", {
        method,
        path,
        client:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip"),
        expectedApiKey: env.apiKey,
      });
      throw new UnauthorizedHttpError("X-API-Key header is required");
    }
    if (apiKey !== env.apiKey) {
      logger.warn("auth.invalid_api_key", {
        method,
        path,
        providedApiKey: apiKey,
        expectedApiKey: env.apiKey,
      });
      throw new UnauthorizedHttpError("Invalid API key");
    }

    logger.info("auth.api_key.accepted", {
      method,
      path,
      providedApiKey: apiKey,
      expectedApiKey: env.apiKey,
      client:
        request.headers.get("x-forwarded-for") ??
        request.headers.get("x-real-ip"),
    });
  })
  .export();
