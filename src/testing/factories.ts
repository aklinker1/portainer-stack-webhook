import { createFactory, createSequence } from "@aklinker1/zero-factory";
import type { PortainerStack } from "../utils/portainer";

export const portainerStackFactory = createFactory<PortainerStack>({
  Id: createSequence(),
  EndpointId: createSequence(),
  Name: createSequence("name-"),
});
