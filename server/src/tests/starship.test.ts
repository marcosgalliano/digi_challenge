jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));

import request from "supertest";
import { server } from "../index";
import mongoose from "mongoose";

describe("Starships API", () => {
  it("should save starships and return correct response", async () => {
    const response = await request(server).post("/api/starships/save");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Proceso de guardado completado."
    );
    expect(response.body).toHaveProperty("createdProducts");
    expect(response.body).toHaveProperty("repeatedProducts");

    const createdLength = response.body.createdProducts.length;
    const repeatedLength = response.body.repeatedProducts.length;

    expect(createdLength > 0 || repeatedLength > 0).toBe(true);
  });
});

describe("Starships API - GET", () => {
  it("should fetch starships and return correct response", async () => {
    const response = await request(server).get("/api/starships");

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("data");

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    const person = response.body.data[0];
    expect(person).toHaveProperty("_id");
    expect(person).toHaveProperty("name");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
