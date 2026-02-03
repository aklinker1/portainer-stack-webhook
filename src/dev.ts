import { violet } from "./colors";
import { env } from "./env";
import "./index";
import { createLogger } from "./utils/logger";

const logger = createLogger("dev");

const res = await fetch(`http://localhost:${env.port}/openapi.json`);
const json = await res.json();
Bun.write("openapi.json", JSON.stringify(json, null, 2));
logger.info(`OpenAPI spec written to ${violet("openapi.json")}`);
