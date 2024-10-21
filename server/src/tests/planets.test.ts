jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));

import request from "supertest";
import { server } from "../index";
import mongoose from "mongoose";

describe("Planets API", () => {
  it("should save planets and return correct response", async () => {
    const response = await request(server).post("/api/planets/save");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Proceso de guardado completado."
    );
    expect(response.body).toHaveProperty("createdPlanets");
    expect(response.body).toHaveProperty("repeatedPlanets");

    const createdLength = response.body.createdPlanets.length;
    const repeatedLength = response.body.repeatedPlanets.length;

    expect(createdLength > 0 || repeatedLength > 0).toBe(true);
  });
});

describe("planets API - GET", () => {
  it("should fetch planets and return correct response", async () => {
    const response = await request(server).get("/api/planets");

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("data");

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    const person = response.body.data[0];
    expect(person).toHaveProperty("population");
    expect(person).toHaveProperty("name");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
