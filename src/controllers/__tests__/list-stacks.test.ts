import { beforeEach, describe, expect, it } from "bun:test";
import { Stack } from "../../models";
import { mockPortainerApi } from "../../utils/testing";
import { listStacks } from "../list-stacks";

const portainer = mockPortainerApi();

describe("GET /api/stacks", () => {
  beforeEach(() => {
    portainer.listStacks.mockReset();
  });

  it("should return the stacks", async () => {
    const stacks = [
      { Id: 1, Name: "service-1", EndpointId: 11 },
      { Id: 2, Name: "service-2", EndpointId: 22 },
    ];
    const expected: Stack[] = [
      { id: 1, name: "service-1" },
      { id: 2, name: "service-2" },
    ];
    portainer.listStacks.mockResolvedValueOnce(stacks);

    const actual = await listStacks({ portainer });

    expect(actual).toEqual(expected);
  });
});
