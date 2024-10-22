import { Request, Response } from "express";
import { fetchPlanets } from "../controllers/planetsController";
import PlanetModel, { IPlanet } from "../models/PlanetModel";
import { PlanetQuery } from "../types";

export const getPlanetsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, climate } = req.query;

    const query: PlanetQuery = {};

    if (name) {
      query.name = { $regex: new RegExp(name as string, "i") };
    }

    if (climate) {
      query.climate = { $regex: new RegExp(climate as string, "i") };
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

      if (existingPlanet) {
        repeatedPlanets.push(existingPlanet.toObject());
      } else {
        const planet = new PlanetModel({
          ...planetData,
          apiId,
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
