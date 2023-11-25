import { Ctx } from "./context";

export function defineRoute(route: Route): Route {
  return route;
}

export interface Route {
  name: string;
  method: string;
  regex: RegExp;
  handler: (
    ctx: Ctx,
    ...pathParams: any[]
  ) => Promise<Response | void> | Response | void;
}
