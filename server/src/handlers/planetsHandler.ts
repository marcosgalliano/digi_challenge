import { Request, Response } from "express";
import { fetchPlanets } from "../controllers/planetsController";
import PlanetModel, { IPlanet } from "../models/PlanetModel";
import { PlanetQuery } from "../types";

export const getPlanetsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, population } = req.query;

    const query: PlanetQuery = {};

    if (name && typeof name === "string") {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (population && typeof population === "string") {
      const populationMatch = population.match(/([<>]=?)\s*(\d+)/);

      if (populationMatch) {
        const operator = populationMatch[1];
        const value = parseInt(populationMatch[2], 10);

        switch (operator) {
          case "<":
            query.population = { $lt: value };
            break;
          case "<=":
            query.population = { $lte: value };
            break;
          case ">":
            query.population = { $gt: value };
            break;
          case ">=":
            query.population = { $gte: value };
            break;
          default:
            query.population = value;
            break;
        }
      } else if (!isNaN(parseInt(population))) {
        query.population = parseInt(population);
      }
    }

    const planets = await PlanetModel.find(query);

    res.status(200).json({ data: planets });
  } catch (error) {
    console.error("Error fetching planets from database:", error);
    res.status(500).json({
      error: "Error al obtener los planetas desde la base de datos.",
    });
  }
};

export const savePlanetsHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const planets = await fetchPlanets();

    const createdPlanets: IPlanet[] = [];
    const repeatedPlanets: IPlanet[] = [];

    for (const planetData of planets) {
      const urlParts = planetData.url.split("/");
      const apiId = parseInt(urlParts[urlParts.length - 2], 10);

      const existingPlanet = await PlanetModel.findOne({
        apiId,
      });

      const populationAsnUmber = isNaN(Number(planetData.population))
        ? null
        : Number(planetData.population);

      if (existingPlanet) {
        repeatedPlanets.push(existingPlanet.toObject());
      } else {
        const planet = new PlanetModel({
          ...planetData,
          apiId,
          population: populationAsnUmber,
        });
        const savedPlanet = await planet.save();
        createdPlanets.push(savedPlanet.toObject());
      }
    }

    res.status(200).json({
      message: "Proceso de guardado completado.",
      createdPlanets,
      repeatedPlanets,
    });
  } catch (error) {
    console.error("Error al guardar los planetas:", error);
    res.status(500).json({
      error: "Error al guardar los planetas en la base de datos.",
    });
  }
};

export const getPlanetByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const planet = await PlanetModel.findById(id);

    if (!planet) {
      res.status(404).json({ message: "Planet not found" });
      return;
    }

    res.status(200).json(planet);
  } catch (error) {
    console.error("Error fetching planet:", error);
    res.status(500).json({ message: "Error fetching planet" });
  }
};
