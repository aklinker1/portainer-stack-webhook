import { NoResponse } from "@aklinker1/zeta";
import z from "zod";

export const Stack = z
  .object({
    id: z.int(),
    name: z.string(),
  })
  .meta({
    ref: "Stack",
  });
export type Stack = z.infer<typeof Stack>;

export const ListStacksOutput = Stack.array().meta({
  ref: "ListStacksOutput",
});
export type ListStacksOutput = z.infer<typeof ListStacksOutput>;

export const GetHealthOutput = z
  .object({
    status: z.string(),
    uptime: z.int().min(0).describe("Uptime in seconds"),
    since: z.iso.datetime(),
    version: z.string(),
  })
  .meta({
    ref: "GetHealthOutput",
  });
export type GetHealthOutput = z.infer<typeof GetHealthOutput>;

export const UpdateStackWebhookInput = z
  .object({
    stackId: z.coerce.number().int().min(0),
  })
  .meta({
    ref: "UpdateStackWebhookInput",
  });
export type UpdateStackWebhookInput = z.infer<typeof UpdateStackWebhookInput>;

export const UpdateStackWebhookOutput = NoResponse.meta({
  responseDescription: "Stack update submitted",
});
export type UpdateStackWebhookOutput = void;
