import { describe, it, expect, mock, beforeEach } from "bun:test";
import { mockPortainerApi } from "../utils/testing";
import { HttpStatus } from "@aklinker1/zeta";
import { ListStacksOutput } from "../models";
import { PortainerStack } from "../utils/portainer";
import { version } from "../version";

const portainer = mockPortainerApi();
mock.module("../utils/portainer", () => ({
  createPortainerApi: () => portainer,
}));

async function expectErrorResponse(response: Response, error: Error) {
  expect(response.status).toBe(HttpStatus.InternalServerError);
  expect(await response.json()).toMatchObject({ message: error.message });
}

describe("App", async () => {
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
      { Id: 1, Name: "service-1", EndpointId: 11 },
      { Id: 2, Name: "service-2", EndpointId: 22 },
    ];
    const expected: ListStacksOutput = [
      { id: 1, name: "service-1" },
      { id: 2, name: "service-2" },
    ];

    it("should return a 200 OK and a list of current stacks", async () => {
      portainer.listStacks.mockResolvedValue(stacks);
      const request = new Request("http://localhost/api/stacks");

      const response = await fetch(request);
      const json = await response.json();

      expect(response.status).toBe(HttpStatus.Ok);
      expect(json).toMatchObject(expected);
    });
  });

  describe("POST /api/webhooks/stacks/{id}", () => {
    const stackId = 123;
    const endpointId = 3;
    const stackFileContent = "<docker compose code>";

    beforeEach(() => {
      portainer.getStack.mockResolvedValue({
        Id: stackId,
        EndpointId: endpointId,
        Name: "Example Stack",
      });
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
          `http://localhost/api/webhooks/stacks/${stackId}`,
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
          `http://localhost/api/webhooks/stacks/${stackId}`,
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
          `http://localhost/api/webhooks/stacks/${stackId}`,
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
        `http://localhost/api/webhooks/stacks/${stackId}`,
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
