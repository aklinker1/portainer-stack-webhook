import { bold, cyan, violet } from "./colors";
import { env } from "./env";
import "./index";

const res = await fetch(`http://localhost:${env.port}/openapi.json`);
const json = await res.json();
Bun.write("openapi.json", JSON.stringify(json, null, 2));
console.log(
  `${cyan(bold("ℹ"))} OpenAPI spec written to ${violet("openapi.json")}`,
);
