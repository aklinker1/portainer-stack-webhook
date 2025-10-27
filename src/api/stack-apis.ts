import { HttpStatus, createApp } from "@aklinker1/zeta";
import {
  ListStacksOutput,
  UpdateStackWebhookInput,
  UpdateStackWebhookOutput,
} from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";

export const stackApis = createApp()
  .use(authPlugin)
  .use(ctxPlugin)
  .get(
    "/api/stacks",
    {
      operationId: "listStacks",
      summary: "List Stacks",
      responses: ListStacksOutput,
    },
    async ({ portainer }) => {
      const stacks = await portainer.listStacks();

      return stacks.map((stack) => ({
        id: stack.Id,
        name: stack.Name,
      }));
    },
  )
  .post(
    "/api/webhooks/stacks/:stackId",
    {
      operationId: "updateStackWebhook",
      summary: "Update Stack Webhook",
      params: UpdateStackWebhookInput,
      responses: {
        [HttpStatus.Accepted]: UpdateStackWebhookOutput,
      },
    },
    async ({ portainer, params, status }) => {
      const [stack, stackFile] = await Promise.all([
        portainer.getStack(params.stackId),
        portainer.getStackFile(params.stackId),
      ]);
      await portainer.updateStack(params.stackId, {
        prune: false,
        pullImage: true,
        endpointId: stack.EndpointId,
        stackFileContent: stackFile.StackFileContent,
      });

      return status(HttpStatus.Accepted, undefined);
    },
  );
