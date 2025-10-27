import { createApp } from "@aklinker1/zeta";
import { ListStacksOutput } from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";

export const stacksApp = createApp()
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
  );
