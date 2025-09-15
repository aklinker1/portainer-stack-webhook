import { bold, cyan, dim, violet } from "./colors";
import { version } from "./version";
import { app } from "./app";

const port = Number(process.env.PORT || 3000);

console.log(`${bold(cyan("Portainer Stack Webhooks"))} ${dim("v" + version)}`);

app.listen(port, () => {
  console.log(
    `${cyan("ℹ")} Server started ${dim("→")} ${violet(
      "http://localhost:" + port,
    )}`,
  );
});

if (process.env.NODE_ENV !== "production") {
  const res = await fetch(`http://localhost:${port}/openapi.json`);
  const json = await res.json();
  Bun.write("openapi.json", JSON.stringify(json, null, 2));
}
