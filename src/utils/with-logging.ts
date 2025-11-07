import { logger } from "./logger";

export const withLogging =
  (name: string, handler: (ctx: any) => Promise<unknown>) =>
  async (ctx: any) => {
    const method = ctx?.method ?? ctx?.request?.method ?? "UNKNOWN";
    const path =
      ctx?.path ?? (ctx?.request?.url ? new URL(ctx.request.url).pathname : "");

    // try to extract client IP from common headers
    const headers = ctx?.request?.headers;
    const rawXff = headers
      ? headers.get?.("x-forwarded-for") ||
        headers.get?.("x-forwarded") ||
        headers.get?.("forwarded-for")
      : null;
    // prefer the first IP in X-Forwarded-For (original client)
    let clientIP: string | null = null;
    if (rawXff) {
      clientIP = String(rawXff).split(",")[0]?.trim() ?? null;
    } else if (
      headers &&
      (headers.get?.("x-real-ip") ||
        headers.get?.("x-client-ip") ||
        headers.get?.("cf-connecting-ip"))
    ) {
      clientIP =
        headers.get("x-real-ip") ||
        headers.get("x-client-ip") ||
        headers.get("cf-connecting-ip") ||
        null;
    } else if (ctx?.request?.conn?.remoteAddress) {
      clientIP = ctx.request.conn.remoteAddress as string;
    }

    const metaBase = {
      route: name,
      method,
      path,
      client: clientIP ?? null,
      xff: rawXff,
    } as Record<string, unknown>;

    logger.info("request.start", metaBase);

    const start = Date.now();
    try {
      const result = await handler(ctx);
      const duration = Date.now() - start;
      // Try to glean numeric status from common places; avoid logging function objects
      const rawStatus = ctx?.response?.status ?? ctx?.status;
      let status: number | undefined = undefined;
      if (typeof rawStatus === "number") status = rawStatus;
      else if (
        typeof rawStatus === "string" &&
        !Number.isNaN(Number(rawStatus))
      )
        status = Number(rawStatus);

      const endMeta = { ...metaBase, duration } as Record<string, unknown>;
      if (status !== undefined) endMeta.status = status;
      logger.info("request.end", endMeta);
      return result;
    } catch (err: any) {
      const duration = Date.now() - start;
      logger.error("request.error", {
        ...metaBase,
        error: err?.message ?? String(err),
        status: typeof err?.status === "number" ? err.status : undefined,
        duration,
      });
      throw err;
    }
  };
