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
      PORTAINER_API_URL: https://portainer.example.com/api  # Required, full URL including /api
      PORTAINER_ACCESS_TOKEN: your-access-token             # Preferred, Portainer access token
      # Legacy (falls back to username/password if no token is provided):
      # PORTAINER_USERNAME: your-username                   # Username to login with
      # PORTAINER_PASSWORD: your-password                   # Password to login with
      PORT: 3000                                            # Optional, default 3000
      API_KEY: your-api-key                                 # Optional, set to a any string to require authentication
```

For available endpoints, see the API Reference below or open `/scalar`. You can also copy-paste [`./openapi.json`](./openapi.json) into [Scalar Editor](https://editor.scalar.com/).

## API Reference

- Base URL: `http://localhost:3000`
- Authentication: if `API_KEY` is set, add header `X-API-Key: <your-api-key>` to every request.

### Health

Check server status, uptime, and version.

```sh
# no auth
curl http://localhost:3000/api/health

# with auth
curl -H "X-API-Key: <your-api-key>" http://localhost:3000/api/health
```

### List stacks

Returns `id` and `name` for each stack (useful for selecting `stackId` or `stackName`).

```sh
# no auth
curl http://localhost:3000/api/stacks

# with auth
curl -H "X-API-Key: <your-api-key>" http://localhost:3000/api/stacks
```

### Update stack by ID

Pull latest images and redeploy a stack by numeric ID.

```sh
# no auth
curl -X POST http://localhost:3000/api/webhook/stacks/id/:stackId

# with auth
curl -X POST -H "X-API-Key: <your-api-key>" http://localhost:3000/api/webhook/stacks/id/:stackId
```

### Update stack by name

Pull latest images and redeploy a stack by name.

```sh
# no auth
curl -X POST http://localhost:3000/api/webhook/stacks/name/:stackName

# with auth
curl -X POST -H "X-API-Key: <your-api-key>" http://localhost:3000/api/webhook/stacks/name/:stackName
```

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
3. Send a request to test it out (see API Reference above for routes)

To run tests:

```sh
bun test
```
