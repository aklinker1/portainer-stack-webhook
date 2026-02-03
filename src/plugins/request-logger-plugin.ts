import { createApp } from "@aklinker1/zeta";
import { createLogger } from "../utils/logger";

const logger = createLogger("http");

export const requestLoggerPlugin = createApp()
  .onGlobalRequest(({ method, path, url, request }) => {
    const startTime = performance.now();
    const requestId = crypto.randomUUID();
    const xff =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-forwarded") ||
      request.headers.get("forwarded-for");
    const clientId = xff?.split(",")[0]?.trim() || null;
    logger.info("Request start", {
      requestId,
      method,
      url: String(url),
      path,
      xff,
      clientId,
    });

    // Return values so they're available in subsequent hooks
    return {
      startTime,
      requestId,
    };
  })
  .onTransform(({ requestId, route }) => {
    logger.info("Route matched", { requestId, route });
  })
  .onGlobalAfterResponse(({ startTime, requestId, response }) => {
    const duration = performance.now() - startTime;
    logger.info("Request end", {
      requestId,
      duration,
      status: response.status,
    });
  })
  .onGlobalError(({ error, requestId }) => {
    logger.error("Request error", {
      requestId,
      error: String(error),
      stack: (error as any)?.stack,
    });
  })
  .export();
