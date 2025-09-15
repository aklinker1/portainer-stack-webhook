import { HttpStatus } from "@aklinker1/zeta";
import { PortainerApi } from "../portainer";
import { UpdateStackWebhookInput } from "../models";

export async function updateStackWebhook(ctx: {
  portainer: PortainerApi;
  params: UpdateStackWebhookInput;
  status: (status: HttpStatus.Accepted, data: any) => any;
}) {
  const [stack, stackFile] = await Promise.all([
    ctx.portainer.getStack(ctx.params.stackId),
    ctx.portainer.getStackFile(ctx.params.stackId),
  ]);
  await ctx.portainer.updateStack(ctx.params.stackId, {
    prune: false,
    pullImage: true,
    endpointId: stack.EndpointId,
    stackFileContent: stackFile.StackFileContent,
  });

  return ctx.status(HttpStatus.Accepted, undefined);
}
