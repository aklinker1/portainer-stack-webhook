import { blue, bold, cyan, dim, violet } from "./utils/colors";
import routes from "./routes";
import { createPortainerApi } from "./utils/portainer";
import { startServer } from "./utils/server";
import { version } from "../package.json";

const port = Number(process.env.PORT || 3000);

console.log(`${bold(cyan("Portainer Stack Webhooks"))} ${dim("v" + version)}`);
console.log(
  `${cyan("ℹ")} Server started ${dim("→")} ${violet(
    "http://localhost:" + port
  )}`
);
startServer({
  port,
  createPortainerApi,
  routes,
});
