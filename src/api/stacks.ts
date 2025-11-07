import { createApp } from "@aklinker1/zeta";
import { ListStacksOutput } from "../models";
import { authPlugin } from "../plugins/auth-plugin";
import { ctxPlugin } from "../plugins/ctx-plugin";
import { withLogging } from "../utils/with-logging";

const listStacksHandler: any = withLogging(
  "GET /api/stacks",
  async ({ portainer }: { portainer: any }) => {
    const stacks = await portainer.listStacks();

    return stacks.map((stack: any) => ({
      id: stack.Id,
      name: stack.Name,
    }));
  },
);

export const stacksApp = createApp().use(authPlugin).use(ctxPlugin).get(
  "/api/stacks",
  {
    operationId: "listStacks",
    summary: "List Stacks",
    responses: ListStacksOutput,
  },
  listStacksHandler,
);
