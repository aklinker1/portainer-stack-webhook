import { env } from "./env";
import "./index";
import { logger } from "./utils/logger";

const res = await fetch(`http://localhost:${env.port}/openapi.json`);
const json = await res.json();
Bun.write("openapi.json", JSON.stringify(json, null, 2));
logger.info("dev.openapi_written", {
  message: "OpenAPI spec written to openapi.json",
});
