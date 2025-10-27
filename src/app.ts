import { createApp } from "@aklinker1/zeta";
import { version } from "../package.json";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { systemApis } from "./api/system-apis";
import { stackApis } from "./api/stack-apis";

export const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "Portainer Stack Webhook",
      version,
    },
  },
})
  .use(systemApis)
  .use(stackApis);
