import { Request, Response } from "express";
import { fetchPeople } from "../controllers/peopleController";
import PersonModel from "../models/PersonModel";
import { PeopleQuery } from "../types";

export const getPeopleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, height, mass } = req.query;

    const query: PeopleQuery = {};

    if (typeof name === "string") {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (typeof height === "string") {
      query.height = height;
    }

    if (typeof mass === "string") {
      query.mass = mass;
    }

    const people = await PersonModel.find(query);

    res.status(200).json({ data: people });
  } catch (error) {
    console.error("Error fetching people from database:", error);
    res.status(500).json({
      error: "Error al obtener los personajes desde la base de datos.",
    });
  }
};

export const savePeopleHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const people = await fetchPeople();

    const createdPeople: any[] = [];
    const repeatedPeople: any[] = [];

    for (const personData of people) {
      const existingPerson = await PersonModel.findOne({
        name: personData.name,
      });

      if (existingPerson) {
        repeatedPeople.push(existingPerson.toObject());
      } else {
        const person = new PersonModel(personData);
        const savedPerson = await person.save();
        createdPeople.push(savedPerson.toObject());
      }
    }

    res.status(200).json({
      message: "Proceso de guardado completado.",
      createdPeople,
      repeatedPeople,
    });
  } catch (error) {
    console.error("Error al guardar los personajes:", error);
    res.status(500).json({
      error: "Error al guardar los personajes en la base de datos.",
    });
  }
};
