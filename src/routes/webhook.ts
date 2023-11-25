import { defineRoute } from "../utils/routes";

export default defineRoute({
  name: "webhook",
  regex: /^\/api\/webhook\/stacks\/(.*)$/,
  method: "POST",

  handler: async (ctx, idStr: string) => {
    const id = Number(idStr);

    const [stack, stackFile] = await Promise.all([
      ctx.portainer.getStack(id),
      ctx.portainer.getStackFile(id),
    ]);
    await ctx.portainer.updateStack(id, {
      prune: true,
      pullImage: true,
      endpointId: stack.EndpointId,
      stackFileContent: stackFile.StackFileContent,
    });
  },
});
