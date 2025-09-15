import { HttpStatus, createApp } from "@aklinker1/zeta";
import { version } from "../package.json";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import {
  GetHealthOutput,
  ListStacksOutput,
  UpdateStackWebhookInput,
  UpdateStackWebhookOutput,
} from "./models";
import { createPortainerApi } from "./portainer";
import { getHealth } from "./controllers/get-health";
import { listStacks } from "./controllers/list-stacks";
import { updateStackWebhook } from "./controllers/update-stack-webhook";

export const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "Portainer Stack Webhook",
      version,
    },
  },
})
  .decorate({
    portainer: await createPortainerApi(),
  })
  .get(
    "/api/health",
    {
      operationId: "getHealth",
      summary: "Get Health",
      responses: GetHealthOutput,
    },
    getHealth,
  )
  .get(
    "/api/stacks",
    {
      operationId: "listStacks",
      summary: "List Stacks",
      responses: ListStacksOutput,
    },
    listStacks,
  )
  .post(
    "/api/webhook/stacks/:stackId",
    {
      operationId: "updateStackWebhook",
      summary: "Update Stack Webhook",
      params: UpdateStackWebhookInput,
      responses: {
        [HttpStatus.Accepted]: UpdateStackWebhookOutput,
      },
    },
    updateStackWebhook,
  );
