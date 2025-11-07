import { bold, dim, red, yellow, green, cyan, violet, blue } from "../colors";

type Meta = Record<string, unknown> | undefined;

const isProd = process.env.NODE_ENV === "production";
const format = (
  process.env.LOG_FORMAT || (isProd ? "json" : "pretty")
).toLowerCase();

function safeString(v: unknown) {
  if (v === undefined) return "";
  if (v === null) return "null";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function prettyAction(message?: string, meta?: Meta) {
  const m = message ?? "";
  // Prefer explicit route if provided
  if (meta && typeof meta["route"] === "string")
    return String(meta["route"] as string);

  // if message looks like `auth.missing_api_key` -> AUTH
  if (String(m).includes(".")) {
    const part = String(m).split(".")[0] ?? "";
    return part.toUpperCase();
  }
  return String(m).toUpperCase();
}

export const createLogger = (service = "portainer-stack-webhook") => {
  const logJson = (level: string, message: string, meta?: Meta) => {
    const entry: Record<string, unknown> = {
      time: new Date().toISOString(),
      service,
      level,
      message,
    };
    if (meta) Object.assign(entry, meta);
    console.log(JSON.stringify(entry));
  };

  const logPretty = (level: string, message: string, meta?: Meta) => {
    const t = new Date().toISOString();
    const lvl =
      level === "error"
        ? red(level.toUpperCase())
        : level === "warn"
          ? yellow(level.toUpperCase())
          : green(level.toUpperCase());
    // derived action (kept as a function call below when needed)

    // method color
    const method = meta?.method ? String(meta.method).toUpperCase() : undefined;
    const methodColored = method
      ? method === "GET"
        ? blue(method)
        : method === "POST"
          ? violet(method)
          : method === "PUT"
            ? yellow(method)
            : method === "DELETE"
              ? red(method)
              : cyan(method)
      : undefined;

    // path (prefer meta.path, fall back to meta.route)
    const pathRaw = meta?.["path"] ?? meta?.["route"];
    const path = pathRaw ? cyan(String(pathRaw)) : undefined;

    // status coloring helper (only color numeric statuses)
    const _colorStatus = (s: unknown) => {
      const n = Number(s);
      if (Number.isInteger(n)) {
        if (n >= 500) return red(String(n));
        if (n >= 400) return yellow(String(n));
        if (n >= 300) return cyan(String(n));
        return green(String(n));
      }
      return undefined;
    };

    // Build display pieces: show only method, concrete path, and client (user requested minimal output)
    const pieces: string[] = [];
    if (methodColored) pieces.push(methodColored);
    if (path) pieces.push(path);
    // only show client IP for compact logs
    const clientPart = meta?.["client"]
      ? `client=${cyan(String(meta["client"]))}`
      : undefined;

    const metaStr = clientPart ? dim(clientPart) : "";

    // If we have method/path pieces, show concise request-style line.
    if (pieces.length > 0) {
      const line = `${dim(t)} ${lvl} ${pieces.join(" ")}${metaStr ? " - " + metaStr : ""}`;
      console.log(line);
      return;
    }

    // Otherwise (non-request logs like global errors), fall back to an action label and show important meta (error/reason)
    const actionLabel = cyan(bold(prettyAction(message, meta)));
    // pick useful meta keys to show (error, reason, message)
    const usefulKeys = ["error", "reason", "message"];
    const useful = meta
      ? Object.entries(meta)
          .filter(([k]) => usefulKeys.includes(k))
          .map(([k, v]) => `${violet(k)}=${safeString(v)}`)
          .join(" ")
      : "";

    const fallbackMeta = useful ? dim(useful) : "";
    const line = `${dim(t)} ${lvl} ${actionLabel}${fallbackMeta ? " - " + fallbackMeta : ""}`;
    console.log(line);
  };

  const choose = format === "json" ? logJson : logPretty;

  return {
    info: (message: string, meta?: Meta) => choose("info", message, meta),
    warn: (message: string, meta?: Meta) => choose("warn", message, meta),
    error: (message: string, meta?: Meta) => choose("error", message, meta),
    debug: (message: string, meta?: Meta) => choose("debug", message, meta),
  } as const;
};

export const logger = createLogger();
