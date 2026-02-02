import { createApp } from "@aklinker1/zeta";
import { version } from "../package.json";
import { zodSchemaAdapter } from "@aklinker1/zeta/adapters/zod-schema-adapter";
import { healthApp } from "./api/health";
import { stacksApp } from "./api/stacks";
import { webhooksApp } from "./api/webhooks";

export const app = createApp({
  schemaAdapter: zodSchemaAdapter,
  openApi: {
    info: {
      title: "Portainer Stack Webhook",
      version,
      description: dedent`
        ## Overview

        Use the [\`Update Stack Webhook\`](#POST/api/webhook/stacks/{stackId})
        endpoint to trigger portainer to pull the latest images for a stack and
        restart.

        This API provides some other endpoints for a health check and to list
        stacks present if you need help finding the stack ID to use.

        ## Environment Variables

        Configure how the application runs with environment variables:

        - \`PORT\` (_default: \`3000\`_) &ndash; Set to an integer to change the port the app is served over.
        - \`PORTAINER_API_URL\` (_required_) &ndash; The URL to your portainer instance's API endpoint, including the \`/api\` suffix.
        - \`PORTAINER_USERNAME\` (_required_) &ndash; Portainer username used to authenticate requests.
        - \`PORTAINER_PASSWORD\` (_required_) &ndash; Portainer password used to authenticate requests.
        - \`API_KEY\` (_optional_) &ndash; If defined, you must pass the defined API key in the \`X-API-Key: <API_KEY>\` header for all requests other than \`/api/health\`.
      `,
    },
  },
})
  .onGlobalError(({ error }) => console.error(error))
  .use(healthApp)
  .use(stacksApp)
  .use(webhooksApp);
