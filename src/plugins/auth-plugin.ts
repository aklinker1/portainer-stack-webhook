import { createApp } from "@aklinker1/zeta";

export const authPlugin = createApp()
  .onTransform(({ headers: _ }) => {
    // TODO: Throw UnauthorizedHttpError if the API key is missing or invalid
  })
  .export();
