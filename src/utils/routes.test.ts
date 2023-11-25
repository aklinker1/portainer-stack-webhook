import { describe, expect, it } from "bun:test";
import { defineRoute } from "./routes";

describe("Route Utils", () => {
  describe("defineRoute", () => {
    it("should return the same route passed in", () => {
      const expected = Symbol("test object ref") as any;

      expect(defineRoute(expected)).toBe(expected);
    });
  });
});
