import { describe, it, expect, beforeEach, mock } from "bun:test";
import { mockPortainerApi } from "../../utils/testing";
import { updateStackWebhook } from "../update-stack-webhook";

const portainer = mockPortainerApi();
const statusMock = mock(() => {
  throw Error("Not implemented");
});

describe("POST /api/webhook/stacks", () => {
  const testUpdateStackWebhook = (id: number) =>
    updateStackWebhook({
      portainer,
      query: { id },
      status: statusMock,
    });

  beforeEach(() => {
    portainer.getStack.mockReset();
    portainer.getStackFile.mockReset();
    portainer.updateStack.mockReset();
    statusMock.mockReset();
  });

  it("should fail if the stack doesn't exist", async () => {
    const id = 1;
    const err = Error("Stack not found");

    portainer.getStack.mockRejectedValue(err);
    portainer.getStackFile.mockRejectedValue(err);

    expect(testUpdateStackWebhook(id)).rejects.toBe(err);
  });

  it("should fail if the update fails", async () => {
    const id = 123;
    const endpointId = 3;
    const stackFileContent = "<docker compose code>";
    const err = Error("Some error");

    portainer.getStack.mockResolvedValue({
      Id: id,
      EndpointId: endpointId,
      Name: "Example Stack",
    });
    portainer.getStackFile.mockResolvedValue({
      StackFileContent: stackFileContent,
    });
    portainer.updateStack.mockRejectedValue(err);

    expect(testUpdateStackWebhook(id)).rejects.toBe(err);
  });

  it("should update the stack, pulling the latest images", async () => {
    const id = 123;
    const endpointId = 3;
    const stackFileContent = "<docker compose code>";

    portainer.getStack.mockResolvedValue({
      Id: id,
      EndpointId: endpointId,
      Name: "Example Stack",
    });
    portainer.getStackFile.mockResolvedValue({
      StackFileContent: stackFileContent,
    });
    portainer.updateStack.mockResolvedValue();

    await testUpdateStackWebhook(id);

    expect(portainer.updateStack.mock.calls).toHaveLength(1);
    expect(portainer.updateStack.mock.calls[0]).toEqual([
      id,
      {
        endpointId,
        stackFileContent,
        prune: false,
        pullImage: true,
      },
    ]);
  });
});
