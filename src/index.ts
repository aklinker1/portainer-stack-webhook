import { blue, cyan, dim, violet } from "./colors";
import { version } from "./version";
import { app } from "./app";
import { env, logEnvWarnings } from "./env";

console.log(`${cyan(blue("Portainer Stack Webhooks"))} ${dim("v" + version)}`);

app.listen(env.port, () => {
  logEnvWarnings();

  console.log(
    `${cyan("ℹ")} Server started ${dim("→")} ${violet(
      "http://localhost:" + env.port,
    )}`,
  );
});
