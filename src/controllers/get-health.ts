import { GetHealthOutput } from "../models";
import { version } from "../version";

const since = new Date();

export function getHealth(): GetHealthOutput {
  return {
    since: since.toISOString(),
    status: "up",
    uptime: Math.floor((Date.now() - since.getTime()) / 1000),
    version,
  };
}
