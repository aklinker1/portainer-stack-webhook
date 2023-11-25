import { PortainerApi } from "./portainer";

export interface Ctx {
  request: Request;
  portainer: PortainerApi;
}
