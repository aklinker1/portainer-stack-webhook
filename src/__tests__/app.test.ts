import { describe, it, expect, mock, beforeEach } from "bun:test";
import { mockPortainer } from "../testing/mock-portainer";
import { HttpStatus } from "@aklinker1/zeta";
import { ListStacksOutput } from "../models";
import { PortainerStack } from "../utils/portainer";
import { version } from "../version";
import { portainerStackFactory } from "../testing/factories";

const portainer = mockPortainer;
mock.module("../utils/portainer", () => ({
  createPortainerApi: () => portainer,
}));

async function expectErrorResponse(response: Response, error: Error) {
  expect(response.status).toBe(HttpStatus.InternalServerError);
  expect(await response.json()).toMatchObject({ message: error.message });
}

describe("App Integration Tests", async () => {
  const { app } = await import("../app");
  const fetch = app.build();

  beforeEach(() => {
    portainer.listStacks.mockReset();
    portainer.getStack.mockReset();
    portainer.getStackFile.mockReset();
    portainer.updateStack.mockReset();
  });

  describe("GET /api/health", () => {
    it("should return 200 OK with some server details", async () => {
      const request = new Request("http://localhost/api/health");

      const response = await fetch(request);
      const json = await response.json();

      expect(response.status).toBe(HttpStatus.Ok);
      expect(json).toEqual({
        version,
        status: "up",
        uptime: expect.any(Number) as any,
        since: expect.any(String) as any,
      });
    });
  });

  describe("GET /api/stacks", () => {
    const stacks: PortainerStack[] = [
      portainerStackFactory(),
      portainerStackFactory(),
    ];
    const expected: ListStacksOutput = [
      { id: stacks[0].Id, name: stacks[0].Name },
      { id: stacks[1].Id, name: stacks[1].Name },
    ];

    it("should return a 200 OK and a list of current stacks", async () => {
      portainer.listStacks.mockResolvedValue(stacks);
      const request = new Request("http://localhost/api/stacks");

      const response = await fetch(request);
      const json = await response.json();

      expect(response.status).toBe(HttpStatus.Ok);
      expect(json).toEqual(expected);
    });
  });

  describe("POST /api/webhook/stacks/{id}", () => {
    const stack = portainerStackFactory();
    const stackId = stack.Id;
    const endpointId = stack.EndpointId;
    const stackFileContent = "<docker compose code>";

    beforeEach(() => {
      portainer.getStack.mockResolvedValue(stack);
      portainer.getStackFile.mockResolvedValue({
        StackFileContent: stackFileContent,
      });
      portainer.updateStack.mockResolvedValue();
    });

    describe("when getStack throws an error", () => {
      it("should fail", async () => {
        const err = Error("Not Found");
        portainer.getStack.mockRejectedValue(err);

        const request = new Request(
          `http://localhost/api/webhook/stacks/${stackId}`,
          {
            method: "POST",
          },
        );
        const response = await fetch(request);

        await expectErrorResponse(response, err);
      });
    });

    describe("when getStackFile throws an error", () => {
      it("should fail", async () => {
        const err = Error("Not Found");
        portainer.getStackFile.mockRejectedValue(err);

        const request = new Request(
          `http://localhost/api/webhook/stacks/${stackId}`,
          {
            method: "POST",
          },
        );
        const response = await fetch(request);

        await expectErrorResponse(response, err);
      });
    });

    describe("when updateStack throws an error", () => {
      it("should fail", async () => {
        const err = Error("Some error");
        portainer.updateStack.mockRejectedValue(err);

        const request = new Request(
          `http://localhost/api/webhook/stacks/${stackId}`,
          {
            method: "POST",
          },
        );
        const response = await fetch(request);

        await expectErrorResponse(response, err);
      });
    });

    it("should update the stack, pulling the latest images", async () => {
      const request = new Request(
        `http://localhost/api/webhook/stacks/${stackId}`,
        {
          method: "POST",
        },
      );
      const response = await fetch(request);

      expect(response.status).toBe(HttpStatus.Accepted);
      expect(portainer.updateStack.mock.calls).toHaveLength(1);
      expect(portainer.updateStack.mock.calls[0]).toEqual([
        stackId,
        {
          endpointId,
          stackFileContent,
          prune: false,
          pullImage: true,
        },
      ]);
    });
  });
});
