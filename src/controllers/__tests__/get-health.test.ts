import { describe, expect, it } from "bun:test";
import { getHealth } from "../get-health";
import { version } from "../../version";

describe("GET /api/health", () => {
  it("should return the health status", () => {
    const actual = getHealth();

    expect(actual).toEqual({
      version,
      status: "up",
      uptime: expect.any(Number) as any,
      since: expect.any(String) as any,
    });
  });
});
