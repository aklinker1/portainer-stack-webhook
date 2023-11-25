import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";
import { startServer } from "./server";
import { Route, defineRoute } from "./routes";
import { mockPortainerApi } from "./testing";

const mockHandler = mock<Route["handler"]>(() => {});

const server = startServer({
  port: 123,
  routes: [
    defineRoute({
      name: "test",
      method: "GET",
      regex: /^\/api\/(.*)$/,
      handler: mockHandler,
    }),
  ],
  createPortainerApi: mockPortainerApi,
});

describe("Server Utils", () => {
  beforeEach(() => {
    mockHandler.mockReset();
  });

  afterAll(() => {
    server.stop();
  });

  describe("startServer", () => {
    it("should return 404 for unknown paths", async () => {
      const request1 = new Request("http://localhost/not/api/test");
      const request2 = new Request("http://localhost/api/test", {
        method: "POST",
      });

      expect(await server.fetch(request1)).toMatchObject({ status: 404 });
      expect(await server.fetch(request2)).toMatchObject({ status: 404 });
      expect(mockHandler.mock.calls).toHaveLength(0);
    });

    it("should execute the route handler when requesting a valid route", async () => {
      const request = new Request("http://localhost/api/test");

      const response = await server.fetch(request);

      expect(response.status).toEqual(200);
      expect(mockHandler.mock.calls).toHaveLength(1);
      expect(mockHandler.mock.calls[0]).toEqual([
        expect.anything() as any,
        "test",
      ]);
    });
  });
});
