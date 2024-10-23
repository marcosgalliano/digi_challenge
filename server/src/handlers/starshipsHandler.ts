import { Request, Response } from "express";
import { fetchStarships } from "../controllers/starshipsController";
import StarshipModel, { IStarship } from "../models/StarshipModel";
import { StarshipQuery } from "../types";

export const saveStarshipsHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const starships = await fetchStarships();

    const starshipsToSave = starships.map((starshipData) => {
      const urlParts = starshipData.url.split("/");
      const apiId = parseInt(urlParts[urlParts.length - 2], 10);

      const starship_cost_number = isNaN(Number(starshipData.cost_in_credits))
        ? null
        : Number(starshipData.cost_in_credits);

      return {
        ...starshipData,
        starshipModel: starshipData.model,
        model: undefined,
        apiId: apiId,
        cost_in_credits: starship_cost_number,
      };
    });

    const createdStarships: IStarship[] = [];
    const repeatedStarships: IStarship[] = [];

    for (const starshipData of starshipsToSave) {
      const existingStarship = await StarshipModel.findOne({
        apiId: starshipData.apiId,
      });

      if (existingStarship) {
        repeatedStarships.push(existingStarship.toObject());
      } else {
        const starship = new StarshipModel(starshipData);
        const savedStarship = await starship.save();
        createdStarships.push(savedStarship.toObject());
      }
    }

    res.status(200).json({
      message: "Proceso de guardado completado.",
      createdStarships,
      repeatedStarships,
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
    const { name, cost_in_credits } = req.query;

    const query: StarshipQuery = {};

    if (name) {
      query.name = { $regex: new RegExp(name as string, "i") };
    }

    if (cost_in_credits) {
      let operator: string | undefined;
      let costValue: string;

      if ((cost_in_credits as string).startsWith("<=")) {
        operator = "<=";
        costValue = (cost_in_credits as string).slice(2);
      } else if ((cost_in_credits as string).startsWith(">=")) {
        operator = ">=";
        costValue = (cost_in_credits as string).slice(2);
      } else if ((cost_in_credits as string).startsWith("<")) {
        operator = "<";
        costValue = (cost_in_credits as string).slice(1);
      } else if ((cost_in_credits as string).startsWith(">")) {
        operator = ">";
        costValue = (cost_in_credits as string).slice(1);
      } else {
        operator = "=";
        costValue = cost_in_credits as string;
      }

      const parsedCost = parseFloat(costValue);

      if (!isNaN(parsedCost)) {
        switch (operator) {
          case "<":
            query.cost_in_credits = { $lt: parsedCost };
            break;
          case ">":
            query.cost_in_credits = { $gt: parsedCost };
            break;
          case "<=":
            query.cost_in_credits = { $lte: parsedCost };
            break;
          case ">=":
            query.cost_in_credits = { $gte: parsedCost };
            break;
          case "=":
            query.cost_in_credits = { $gte: parsedCost, $lte: parsedCost };
            break;
          default:
            break;
        }
      }
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
    res.status(500).json({
      error: "Error al obtener las naves estelares desde la base de datos.",
    });
  }
};

export const getStarshipByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const starship = await StarshipModel.findById(id);

    if (!starship) {
      res.status(404).json({ message: "Starship not found" });
      return;
    }

    res.status(200).json(starship);
  } catch (error) {
    console.error("Error fetching starship:", error);
    res.status(500).json({ message: "Error fetching starship" });
  }
};
