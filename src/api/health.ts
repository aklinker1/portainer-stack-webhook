import { createApp } from "@aklinker1/zeta";
import { GetHealthOutput } from "../models";
import { version } from "../version";

const since = new Date();

export const healthApp = createApp().get(
  "/api/health",
  {
    operationId: "getHealth",
    summary: "Get Health",
    responses: GetHealthOutput,
  },
  () => ({
    since: since.toISOString(),
    status: "up",
    uptime: Math.floor((Date.now() - since.getTime()) / 1000),
    version,
  }),
);
