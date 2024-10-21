import { Request, Response } from "express";
import { fetchStarships } from "../controllers/starshipsController";
import StarshipModel from "../models/StarshipModel";
import { StarshipQuery } from "../types";

export const saveStarshipsHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const starships = await fetchStarships();

    const starshipsToSave = starships.map((starshipData) => ({
      ...starshipData,
      starshipModel: starshipData.model,
      model: undefined,
    }));

    const createdProducts: any[] = [];
    const repeatedProducts: any[] = [];

    for (const starshipData of starshipsToSave) {
      const existingStarship = await StarshipModel.findOne({
        name: starshipData.name,
        starshipModel: starshipData.starshipModel,
      });

      if (existingStarship) {
        repeatedProducts.push(existingStarship.toObject());
      } else {
        const starship = new StarshipModel(starshipData);
        const savedStarship = await starship.save();
        createdProducts.push(savedStarship.toObject());
      }
    }

    res.status(200).json({
      message: "Proceso de guardado completado.",
      createdProducts,
      repeatedProducts,
    });
  } catch (error) {
    console.error("Error al guardar las naves estelares:", error);
    res.status(500).json({
      error: "Error al guardar las naves estelares en la base de datos.",
    });
  }
};

export const getStarshipsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, model } = req.query;

    const query: StarshipQuery = {};
    if (name) {
      query.name = { $regex: new RegExp(name as string, "i") };
    }
    if (model) {
      query.starshipModel = { $regex: new RegExp(model as string, "i") };
    }

    const starships = await StarshipModel.find(query);

    const starshipsWithModel = starships.map((starship) => ({
      ...starship.toObject(),
      model: starship.starshipModel,
      starshipModel: undefined,
    }));

    res.status(200).json({ data: starshipsWithModel });
  } catch (error) {
    console.error("Error fetching starships from database:", error);
    res
      .status(500)
      .json({
        error: "Error al obtener las naves estelares desde la base de datos.",
      });
  }
};
