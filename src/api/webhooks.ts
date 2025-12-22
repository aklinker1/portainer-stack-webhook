import { HttpStatus, createApp } from "@aklinker1/zeta";
import {
  UpdateStackWebhookByIdInput,
  UpdateStackWebhookByNameInput,
  UpdateStackWebhookByNameQuery,
  UpdateStackWebhookOutput,
} from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";
import { logger } from "../utils/logger";
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

const findStackByName = (
  stacks: any[],
  stackName: string,
  endpointId?: number,
) => {
  const matches = stacks.filter((s: any) => s.Name === stackName);
  if (matches.length === 0) throw new Error(`Stack not found: ${stackName}`);

  if (endpointId !== undefined) {
    const match = matches.find((s: any) => s.EndpointId === endpointId);
    if (!match)
      throw new Error(
        `Stack not found: ${stackName} on endpoint ${endpointId}`,
      );
    return match;
  }

  if (matches.length > 1)
    throw new Error(
      `Multiple stacks found with name ${stackName}; provide endpointId or use stack ID`,
    );

  return matches[0];
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
        void updateStackById(params.stackId, portainer).catch((error) => {
          logger.error("webhook.update_failed", {
            route: "POST /api/webhook/stacks/id/:stackId",
            stackId: params.stackId,
            error: String(error),
          });
        });
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
      query: UpdateStackWebhookByNameQuery,
      responses: {
        [HttpStatus.Accepted]: UpdateStackWebhookOutput,
      },
    },
    withLogging(
      "POST /api/webhook/stacks/name/:stackName",
      async ({ params, query, portainer, status }: any) => {
        const stacks = await portainer.listStacks();
        const stackSummary = findStackByName(
          stacks,
          params.stackName,
          query?.endpointId,
        );

        void updateStackById(stackSummary.Id, portainer).catch((error) => {
          logger.error("webhook.update_failed", {
            route: "POST /api/webhook/stacks/name/:stackName",
            stackId: stackSummary.Id,
            stackName: params.stackName,
            endpointId: stackSummary.EndpointId,
            error: String(error),
          });
        });
        return status(HttpStatus.Accepted, undefined);
      },
    ) as any,
  );
