import { NoResponse } from "@aklinker1/zeta";
import z from "zod";

export const Stack = z.object({
  id: z.int(),
  name: z.string(),
});
export type Stack = z.infer<typeof Stack>;

export const ListStacksOutput = Stack.array();
export type ListStacksOutput = z.infer<typeof ListStacksOutput>;

export const GetHealthOutput = z.object({
  status: z.string(),
  uptime: z.int().min(0).describe("Uptime in seconds"),
  since: z.iso.datetime(),
  version: z.string(),
});
export type GetHealthOutput = z.infer<typeof GetHealthOutput>;

export const UpdateStackWebhookInput = z.object({
  stackId: z.coerce.number().int().min(0),
});
export type UpdateStackWebhookInput = z.infer<typeof UpdateStackWebhookInput>;

export const UpdateStackWebhookOutput = NoResponse.meta({
  responseDescription: "Stack update submitted",
});
export type UpdateStackWebhookOutput = void;
