import { ListStacksOutput } from "../models";
import { PortainerApi } from "../portainer";

export async function listStacks(ctx: {
  portainer: PortainerApi;
}): Promise<ListStacksOutput> {
  const stacks = await ctx.portainer.listStacks();

  return stacks.map((stack) => ({
    id: stack.Id,
    name: stack.Name,
  }));
}
