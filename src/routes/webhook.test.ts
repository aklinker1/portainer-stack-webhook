import { describe, it, expect, beforeEach } from "bun:test";
import { mockPortainerApi } from "../utils/testing";
import { Ctx } from "../utils/context";
import webhook from "./webhook";

const request = new Request("http://localhost:3000/api/webhook/stacks", {
  method: "POST",
});
const portainer = mockPortainerApi();
const ctx: Ctx = {
  request,
  portainer,
};

describe("webhook route", () => {
  beforeEach(() => {
    portainer.getStack.mockReset();
    portainer.getStackFile.mockReset();
    portainer.updateStack.mockReset();
  });

  it("should fail if the stack doesn't exist", async () => {
    const err = Error("Stack not found");

    portainer.getStack.mockRejectedValue(err);
    portainer.getStackFile.mockRejectedValue(err);

    expect(webhook.handler(ctx, "123")).rejects.toBe(err);
  });

  it("should fail if the update fails", async () => {
    const id = 123;
    const endpointId = 3;
    const stackFileContent = "<docker compose code>";
    const err = Error("Some error");

    portainer.getStack.mockResolvedValue({
      Id: id,
      EndpointId: endpointId,
    });
    portainer.getStackFile.mockResolvedValue({
      StackFileContent: stackFileContent,
    });
    portainer.updateStack.mockRejectedValue(err);

    expect(webhook.handler(ctx, String(id))).rejects.toBe(err);
  });

  it("should update the stack, pulling the latest images", async () => {
    const id = 123;
    const endpointId = 3;
    const stackFileContent = "<docker compose code>";

    portainer.getStack.mockResolvedValue({
      Id: id,
      EndpointId: endpointId,
    });
    portainer.getStackFile.mockResolvedValue({
      StackFileContent: stackFileContent,
    });
    portainer.updateStack.mockResolvedValue();

    await webhook.handler(ctx, String(id));

    expect(portainer.updateStack.mock.calls).toHaveLength(1);
    expect(portainer.updateStack.mock.calls[0]).toEqual([
      id,
      {
        endpointId,
        stackFileContent,
        prune: true,
        pullImage: true,
      },
    ]);
  });
});
