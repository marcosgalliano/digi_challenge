jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));

import request from "supertest";
import { server } from "../index";
import mongoose from "mongoose";

describe("People API - POST", () => {
  it("should save people and return correct response", async () => {
    const response = await request(server).post("/api/people/save");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Proceso de guardado completado."
    );
    expect(response.body).toHaveProperty("createdPeople");
    expect(response.body).toHaveProperty("repeatedPeople");

    const createdLength = response.body.createdPeople.length;
    const repeatedLength = response.body.repeatedPeople.length;

    expect(createdLength > 0 || repeatedLength > 0).toBe(true);
  });
});

describe("People API - GET", () => {
  it("should fetch people and return correct response", async () => {
    const response = await request(server).get("/api/people");

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
