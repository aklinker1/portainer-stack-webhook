import { createApp } from "@aklinker1/zeta";
import { logger } from "./utils/logger";
import { version } from "../package.json";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { healthApp } from "./api/health";
import { stacksApp } from "./api/stacks";
import { webhooksApp } from "./api/webhooks";

export const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "Portainer Stack Webhook",
      version,
    },
  },
})
  .onGlobalError(({ error }) => logger.error("global.error", { error: String(error) }))
  .use(healthApp)
  .use(stacksApp)
  .use(webhooksApp);
