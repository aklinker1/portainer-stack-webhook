import { HttpStatus, NoResponse, createApp } from "@aklinker1/zeta";
import { UpdateStackWebhookInput } from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";

export const webhookApis = createApp()
  .use(authPlugin)
  .use(ctxPlugin)
  .post(
    "/api/webhook/stacks/:stackId",
    {
      operationId: "updateStackWebhook",
      params: UpdateStackWebhookInput,
      responses: {
        [HttpStatus.Accepted]: NoResponse.meta({
          responseDescription: "Stack update submitted",
        }),
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
