import z from "zod";

export const ServerHealth = z
  .object({
    status: z.string(),
    uptime: z.int().min(0).describe("Uptime in seconds"),
    since: z.iso.datetime(),
    version: z.string(),
  })
  .meta({ ref: "ServerHealth" });
export type ServerHealth = z.infer<typeof ServerHealth>;

export const Stack = z
  .object({
    id: z.int(),
    name: z.string(),
  })
  .meta({
    ref: "Stack",
  });
export type Stack = z.infer<typeof Stack>;

export const ListStacksOutput = Stack.array();
export type ListStacksOutput = z.infer<typeof ListStacksOutput>;

export const GetHealthOutput = ServerHealth;
export type GetHealthOutput = z.infer<typeof GetHealthOutput>;

export const UpdateStackWebhookInput = z.object({
  stackId: z.coerce.number().int().min(0),
});
export type UpdateStackWebhookInput = z.infer<typeof UpdateStackWebhookInput>;
