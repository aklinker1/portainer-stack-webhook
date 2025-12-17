import { HttpStatus, createApp } from "@aklinker1/zeta";
import {
  UpdateStackWebhookByIdInput,
  UpdateStackWebhookByNameInput,
  UpdateStackWebhookOutput,
} from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";
import { withLogging } from "../utils/with-logging";

const updateStackById = async (
  stackId: number,
  portainer: any,
): Promise<void> => {
  const [stack, stackFile] = await Promise.all([
    portainer.getStack(stackId),
    portainer.getStackFile(stackId),
  ]);
  await portainer.updateStack(stackId, {
    prune: false,
    pullImage: true,
    endpointId: stack.EndpointId,
    stackFileContent: stackFile.StackFileContent,
  });
};

export const webhooksApp = createApp()
  .use(authPlugin)
  .use(ctxPlugin)
  .post(
    "/api/webhook/stacks/id/:stackId",
    {
      operationId: "updateStackWebhookById",
      summary: "Update Stack Webhook by ID",
      params: UpdateStackWebhookByIdInput,
      responses: {
        [HttpStatus.Accepted]: UpdateStackWebhookOutput,
      },
    },
    withLogging(
      "POST /api/webhook/stacks/id/:stackId",
      async ({ params, portainer, status }: any) => {
        await updateStackById(params.stackId, portainer);
        return status(HttpStatus.Accepted, undefined);
      },
    ) as any,
  )
  .post(
    "/api/webhook/stacks/name/:stackName",
    {
      operationId: "updateStackWebhookByName",
      summary: "Update Stack Webhook by Name",
      params: UpdateStackWebhookByNameInput,
      responses: {
        [HttpStatus.Accepted]: UpdateStackWebhookOutput,
      },
    },
    withLogging(
      "POST /api/webhook/stacks/name/:stackName",
      async ({ params, portainer, status }: any) => {
        const stacks = await portainer.listStacks();
        const stackSummary = stacks.find(
          (s: any) => s.Name === params.stackName,
        );
        if (!stackSummary)
          throw new Error(`Stack not found: ${params.stackName}`);

        await updateStackById(stackSummary.Id, portainer);
        return status(HttpStatus.Accepted, undefined);
      },
    ) as any,
  );
