import request from "supertest";
import { createServer } from "../src/server";

describe("Health endpoint", () => {
  it("should return status ok", async () => {
    const app = createServer();
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
