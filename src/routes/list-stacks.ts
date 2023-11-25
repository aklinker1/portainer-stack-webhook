import { JsonResponse } from "../utils/responses";
import { defineRoute } from "../utils/routes";

export default defineRoute({
  name: "list-stacks",
  method: "GET",
  regex: /$\/api\/stacks\/?^/,
  async handler(ctx) {
    const stacks = (await ctx.portainer.listStacks()).map((stack) => ({
      id: stack.Id,
      name: stack.Name,
    }));
    return new JsonResponse(200, stacks);
  },
});
