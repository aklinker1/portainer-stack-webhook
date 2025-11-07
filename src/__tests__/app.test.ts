import { describe, it, expect, mock, beforeEach } from "bun:test";
import { mockPortainer } from "../testing/mock-portainer";
import { HttpStatus } from "@aklinker1/zeta";
import { ListStacksOutput } from "../models";
import type { PortainerStack } from "../utils/portainer";
import { version } from "../version";
import { portainerStackFactory } from "../testing/factories";
import { env } from "../env";

mock.module("../env", () => ({
  env: {},
}));
const API_KEY = "random-text";

const portainer = mockPortainer;
mock.module("../utils/portainer", () => ({
  createPortainerApi: () => portainer,
}));

async function expectErrorResponse(response: Response, error: Error) {
  expect(response.status).toBe(HttpStatus.InternalServerError);
  expect(await response.json()).toMatchObject({ message: error.message });
}

async function expectUnauthorizedResponse(response: Response, message: string) {
  expect(response.status).toBe(HttpStatus.Unauthorized);
  expect(await response.json()).toMatchObject({ message });
}

describe("App Integration Tests", async () => {
  const { app } = await import("../app");
  const fetch = app.build();

  beforeEach(() => {
    portainer.listStacks.mockReset();
    portainer.getStack.mockReset();
    portainer.getStackFile.mockReset();
    portainer.updateStack.mockReset();
    env.apiKey = API_KEY;
  });

  describe("GET /api/health", () => {
    const sendRequest = async () =>
      fetch(new Request(`http://localhost/api/health`));

    const expectSuccess = async (response: Response) => {
      expect(response.status).toBe(HttpStatus.Ok);
      expect(await response.json()).toEqual({
        version,
        status: "up",
        uptime: expect.any(Number) as any,
        since: expect.any(String) as any,
      });
    };

    it("should return 200 OK with some server details", async () => {
      const response = await sendRequest();

      await expectSuccess(response);
    });
  });

  describe("GET /api/stacks", () => {
    const stacks: PortainerStack[] = [
      portainerStackFactory(),
      portainerStackFactory(),
    ];
    const expected: ListStacksOutput = [
      { id: stacks[0]!.Id, name: stacks[0]!.Name },
      { id: stacks[1]!.Id, name: stacks[1]!.Name },
    ];

    const sendRequest = async (apiKey: string | null = API_KEY) => {
      const headers: Record<string, string> = {
        "X-Forwarded-For": "203.0.113.5",
      };
      if (apiKey) headers["X-API-Key"] = apiKey;
      return fetch(
        new Request(`http://localhost/api/stacks`, {
          headers,
        }),
      );
    };

    const expectSuccess = async (response: Response) => {
      expect(response.status).toBe(HttpStatus.Ok);
      expect(await response.json()).toEqual(expected);
    };

    beforeEach(() => {
      portainer.listStacks.mockResolvedValue(stacks);
    });

    describe("when env.apiKey is set", () => {
      describe("when no API key is provided", () => {
        it("should return 401 Unauthorized", async () => {
          const response = await sendRequest(null);

          await expectUnauthorizedResponse(
            response,
            "X-API-Key header is required",
          );
        });
      });

      describe("when an invalid API key is provided", () => {
        it("should return 401 Unauthorized", async () => {
          const response = await sendRequest("not" + API_KEY);

          await expectUnauthorizedResponse(response, "Invalid API key");
        });
      });
    });

    describe("when env.apiKey is not set", () => {
      beforeEach(() => {
        env.apiKey = undefined;
      });

      it("should return 200 OK should return a 200 OK and a list of current stacks", async () => {
        const response = await sendRequest(null);

        await expectSuccess(response);
      });
    });

    it("should return a 200 OK and a list of current stacks", async () => {
      const response = await sendRequest();

      await expectSuccess(response);
    });
  });

  describe("POST /api/webhook/stacks/{id}", () => {
    const stack = portainerStackFactory();
    const stackId = stack.Id;
    const endpointId = stack.EndpointId;
    const stackFileContent = "<docker compose code>";

    const sendRequest = async (apiKey: string | null = API_KEY) => {
      const headers: Record<string, string> = {
        "X-Forwarded-For": "203.0.113.5",
      };
      if (apiKey) headers["X-API-Key"] = apiKey;
      return fetch(
        new Request(`http://localhost/api/webhook/stacks/${stackId}`, {
          method: "POST",
          headers,
        }),
      );
    };

    const expectSuccess = (response: Response) => {
      expect(response.status).toBe(HttpStatus.Accepted);
      expect(portainer.updateStack).toBeCalledTimes(1);
      expect(portainer.updateStack).toBeCalledWith(stackId, {
        endpointId,
        stackFileContent,
        prune: false,
        pullImage: true,
      });
    };

    beforeEach(() => {
      portainer.getStack.mockResolvedValue(stack);
      portainer.getStackFile.mockResolvedValue({
        StackFileContent: stackFileContent,
      });
      portainer.updateStack.mockResolvedValue();
    });

    describe("when getStack throws an error", () => {
      const err = Error("Not Found");

      beforeEach(() => {
        portainer.getStack.mockRejectedValue(err);
      });

      it("should fail", async () => {
        const response = await sendRequest();

        await expectErrorResponse(response, err);
      });
    });

    describe("when getStackFile throws an error", () => {
      const err = Error("Not Found");

      beforeEach(() => {
        portainer.getStackFile.mockRejectedValue(err);
      });

      it("should fail", async () => {
        const response = await sendRequest();

        await expectErrorResponse(response, err);
      });
    });

    describe("when updateStack throws an error", () => {
      const err = Error("Some error");

      beforeEach(() => {
        portainer.updateStack.mockRejectedValue(err);
      });

      it("should fail", async () => {
        const response = await sendRequest();

        await expectErrorResponse(response, err);
      });
    });

    describe("when env.apiKey is set", () => {
      describe("when no API key is provided", () => {
        it("should fail", async () => {
          const response = await sendRequest(null);

          await expectUnauthorizedResponse(
            response,
            "X-API-Key header is required",
          );
        });
      });

      describe("when an invalid API key is provided", () => {
        it("should fail", async () => {
          const response = await sendRequest("not" + API_KEY);

          await expectUnauthorizedResponse(response, "Invalid API key");
        });
      });
    });

    describe("when env.apiKey is not set", () => {
      beforeEach(() => {
        env.apiKey = undefined;
      });

      it("should update the stack, pulling the latest images", async () => {
        const response = await sendRequest(null);

        expectSuccess(response);
      });
    });

    it("should update the stack, pulling the latest images", async () => {
      const response = await sendRequest();

      expectSuccess(response);
    });
  });
});
