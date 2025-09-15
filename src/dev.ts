import { bold, cyan, violet } from "./colors";
import "./index";
import { port } from "./port";

if (process.env.NODE_ENV !== "production") {
  const res = await fetch(`http://localhost:${port}/openapi.json`);
  const json = await res.json();
  Bun.write("openapi.json", JSON.stringify(json, null, 2));
  console.log(
    `${cyan(bold("ℹ"))} OpenAPI spec written to ${violet("openapi.json")}`,
  );
}
