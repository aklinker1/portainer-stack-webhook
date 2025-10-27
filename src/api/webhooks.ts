import { HttpStatus, createApp } from "@aklinker1/zeta";
import { UpdateStackWebhookInput, UpdateStackWebhookOutput } from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";

export const webhooksApp = createApp()
  .use(authPlugin)
  .use(ctxPlugin)
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
    async ({ params, portainer, status }) => {
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
