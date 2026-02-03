import { cyan, dim, red, yellow } from "../colors";
import { env } from "../env";

type LogFn = (message: string, data?: Record<string, any>) => void;
type FatalFn = (message: string, data?: Record<string, any>) => never;

export interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: FatalFn;
}

type Printer = (
  tag: string,
  consoleFn: (...args: any[]) => void,
  level: keyof Logger,
) => LogFn;

const PRETTY_SYMBOLS: Record<keyof Logger, string> = {
  debug: dim("⚙"),
  info: cyan("ℹ"),
  warn: yellow("⚠"),
  error: red("✖"),
  fatal: red("✖"),
};

const prettyPrinter: Printer = (tag, consoleFn, level) => (message, data) => {
  const args: any[] = [PRETTY_SYMBOLS[level], dim(tag), message];
  if (data) args.push(data);
  consoleFn(...args);
};

const jsonPrinter: Printer = (tag, consoleFn, level) => (message, data) => {
  consoleFn(
    JSON.stringify({
      time: new Date().toISOString(),
      level,
      tag,
      message: Bun.stripANSI(message),
      ...data,
    }),
  );
};

export function createLogger(tag: string): Logger {
  const printer = env.logFormat === "json" ? jsonPrinter : prettyPrinter;

  const fatal = printer(tag, console.error, "fatal");

  return {
    debug: printer(tag, console.debug, "debug"),
    info: printer(tag, console.info, "info"),
    warn: printer(tag, console.warn, "warn"),
    error: printer(tag, console.error, "error"),
    fatal: (...args) => {
      fatal(...args);
      process.exit(1);
    },
  };
}

export const appLogger = createLogger("app");
