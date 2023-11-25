# Portainer Stack Webhook

An equivalent solution to Portainer BE's [Automatic Stack Updates](https://www.portainer.io/business-upsell?from=stack-webhook) feature, but free.

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
      BASE_URL: https://portainer.example.com/api # Required, full URL including /api
      USERNAME: your-username                     # Required, username to login with
      PASSWORD: your-password                     # Required, password to login with
      PORT: 3000                                  # Optional, default 3000
```

To tell Portainer to pull the latest images and update the stack, make a simple POST request:

```sh
curl -X POST http://localhost:3000/api/webhook/stacks/:stackId
```

> [!NOTE]
> The `stackId` can be retrieved from the URL when visiting the stack details in Portainer. In the URL below, it would be `22` from the `id=22` query parameter.
>
> ```
> https://portainer.example.com/#!/1/docker/stacks/some_stack?id=22&type=1&regular=true&external=false&orphaned=false
> ```

## Contributing

To install dependencies:

```bash
bun install
```

To run:

1. Copy the `.env.template` to `.env` and fill it out with your portainer instance's info:
   ```sh
   cp .env.template .env
   bun dev
   ```
2. Start the server
   ```sh
   bun dev
   ```
3. Send a request to test it out
   ```sh
   curl -X POST http://localhost:3000/api/webhook/stacks/123
   ```

> I have not setup tests yet, this is a very simple server, so just test changes manually or contribute and add some tests!
