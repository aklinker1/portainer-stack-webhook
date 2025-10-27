import { createApp, UnauthorizedHttpError } from "@aklinker1/zeta";
import { env } from "../env";

export const authPlugin = createApp()
  .onTransform(({ request }) => {
    // Allow unauthenticated requests if no API key is provided
    if (!env.apiKey) return;

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey)
      throw new UnauthorizedHttpError("X-API-Key header is required");
    if (apiKey !== env.apiKey)
      throw new UnauthorizedHttpError("Invalid API key");
  })
  .export();
