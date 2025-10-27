import { mock } from "bun:test";
import { PortainerApi } from "../utils/portainer";

export const mockPortainerApi = {
  listStacks: mock<PortainerApi["listStacks"]>(() => {
    throw Error("Not implemented");
  }),
  getStack: mock<PortainerApi["getStack"]>(() => {
    throw Error("Not implemented");
  }),
  getStackFile: mock<PortainerApi["getStackFile"]>(() => {
    throw Error("Not implemented");
  }),
  updateStack: mock<PortainerApi["updateStack"]>(() => {
    throw Error("Not implemented");
  }),
} satisfies PortainerApi;
