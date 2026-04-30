
# Portainer Stack Webhook

An equivalent solution to Portainer BE's [Automatic Stack Updates](https://www.portainer.io/business-upsell?from=stack-webhook) feature, but free.

> [!WARNING]
>
> If you're deploying stacks, you may want to use ["Service Webhooks"](https://docs.portainer.io/user/docker/services/webhooks) instead of the stack webhooks. They're hard to find by just poking around. I missed them, so I created this app to update my services - but what I really needed were service webhooks, which are already free.
>
> So here's how to find them:
> 1. Going to your stack
> 2. Clicking on the service you want to add a webhook for
> 3. The service webhook is located in the "Service details" section
>
> Service webhooks will work for you if your image uses the `:latest` tag or any other tag that you pushed a new version of the image to.
>
> This app is only useful if you need to restart an entire stack.

Just run the container, tell it how to access your portainer instance, and tada, it's done! :tada:

<!-- prettier-ignore -->
```yaml
# docker-compose.yml
services:
  stack-webhook:
    image: aklinker1/portainer-stack-webhook
    ports:
      - 3000:3000
    environment:
      PORTAINER_API_URL: https://portainer.example.com/api  # Required, full URL including /api
      PORTAINER_USERNAME: your-username                     # Required, username to login with
      PORTAINER_PASSWORD: your-password                     # Required, password to login with
      PORT: 3000                                            # Optional, default 3000
      API_KEY: your-api-key                                 # Optional, set to a any string to require authentication
      LOG_LEVEL: json                                       # Optional, control the log format ("pretty" | "json")
```

To tell Portainer to pull the latest images and update the stack, make a simple POST request:

```sh
# No authentication
curl -X POST http://localhost:3000/api/webhook/stacks/:stackId

# With an API key
curl -X POST -H "X-API-Key: <your-api-key>" http://localhost:3000/api/webhook/stacks/:stackId
```

You can get the `stackId` from the `GET /api/stacks` endpoint.

For other available APIs, see `/scalar` or copy-paste [`./openapi.json`](./openapi.json) into [Scalar Editor](https://editor.scalar.com/)

## Contributing

To install dependencies:

```bash
bun install
```

`@aklinker1/zeta` docs: https://jsr.io/@aklinker1/zeta

To run:

1. Copy the `.env.template` to `.env` and fill it out with your portainer instance's info:
   ```sh
   cp .env.template .env
   ```
2. Start the server
   ```sh
   bun dev
   ```
3. Send a request to test it out
   ```sh
   curl -X POST http://localhost:3000/api/webhook/stacks/123
   ```

To run tests:

```sh
bun test
```
