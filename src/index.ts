import { cyan, dim } from "./utils/colors";
import routes from "./routes";
import { createPortainerApi } from "./utils/portainer";
import { startServer } from "./utils/server";

const port = Number(process.env.PORT || 3000);

console.log(
  `${cyan("ℹ")} Server started ${dim("→")} ${cyan("http://localhost:" + port)}`
);
startServer({
  port,
  createPortainerApi,
  routes,
});
