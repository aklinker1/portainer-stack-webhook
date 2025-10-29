import { createApp } from "@aklinker1/zeta";
import { createPortainerApi } from "../utils/portainer";

export const ctxPlugin = createApp()
  .decorate({
    portainer: createPortainerApi(),
  })
  .export();
