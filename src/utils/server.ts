import { Ctx } from "./context";
import { ApiError, FetchError } from "./errors";
import { PortainerApi } from "./portainer";
import { Route } from "./routes";

export function startServer(options: {
  port: number;
  routes: Route[];
  createPortainerApi: () => Promise<PortainerApi> | PortainerApi;
}) {
  return Bun.serve({
    port: options.port,
    async fetch(request) {
      console.log("STARTED");
      try {
        const url = new URL(request.url, "http://localhost");
        for (const route of options.routes) {
          console.log("-", route.name);
          const matches = route.regex.exec(url.pathname);
          if (matches && route.method === request.method) {
            const ctx: Ctx = {
              request,
              portainer: await options.createPortainerApi(),
            };
            const response = await route.handler(ctx, ...matches.slice(1));
            return response ?? new Response();
          }
        }

        const available = options.routes.map(
          (op) =>
            `${op.method} ${op.regex
              .toString()
              .slice(2, -2)
              .replaceAll("\\", "")}`
        );
        throw new ApiError(
          404,
          `"${request.method} ${url.pathname}" did not match an endpoints`,
          { routes: available }
        );
      } catch (err) {
        console.log(err);
        // Return responses for handled errors
        if (err instanceof ApiError) return err.toResponse();
        if (err instanceof FetchError) return err.toResponse();

        // Throw error on unknown errors
        throw err;
      }
    },
    error(err) {
      console.error(err);
    },
  });
}
