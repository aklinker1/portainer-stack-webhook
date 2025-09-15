import { bold, cyan, dim, violet } from "./colors";
import { version } from "./version";
import { app } from "./app";
import { port } from "./port";

console.log(`${bold(cyan("Portainer Stack Webhooks"))} ${dim("v" + version)}`);

app.listen(port, () => {
  console.log(
    `${cyan("ℹ")} Server started ${dim("→")} ${violet(
      "http://localhost:" + port,
    )}`,
  );
});
