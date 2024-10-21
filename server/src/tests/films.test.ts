jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));

import request from "supertest";
import { server } from "../index";
import mongoose from "mongoose";

describe("Films API - POST", () => {
  it("should save films and return correct response", async () => {
    const response = await request(server).post("/api/films/save");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Proceso de guardado completado."
    );
    expect(response.body).toHaveProperty("createdFilms");
    expect(response.body).toHaveProperty("repeatedFilms");

    const createdLength = response.body.createdFilms.length;
    const repeatedLength = response.body.repeatedFilms.length;

    expect(createdLength > 0 || repeatedLength > 0).toBe(true);
  });
});

describe("Films API - GET", () => {
  it("should fetch Films and return correct response", async () => {
    const response = await request(server).get("/api/films");

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("data");

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    const person = response.body.data[0];
    expect(person).toHaveProperty("episode_id");
    expect(person).toHaveProperty("title");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
