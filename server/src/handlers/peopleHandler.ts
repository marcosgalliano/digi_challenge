import { Request, Response } from "express";
import { fetchPeople } from "../controllers/peopleController";
import PersonModel, { IPerson } from "../models/PersonModel";
import { PeopleQuery } from "../types";

export const getPeopleHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, height } = req.query;

    const query: PeopleQuery = {};

    if (typeof name === "string") {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (typeof height === "string") {
      const heightMatch = height.match(/([<>]=?)\s*(\d+)/);

      if (heightMatch) {
        const operador = heightMatch[1];
        const valorAltura = parseInt(heightMatch[2], 10);

        switch (operador) {
          case ">":
            query.height = { $gt: valorAltura };
            break;
          case ">=":
            query.height = { $gte: valorAltura };
            break;
          case "<":
            query.height = { $lt: valorAltura };
            break;
          case "<=":
            query.height = { $lte: valorAltura };
            break;
        }
      } else if (!isNaN(Number(height))) {
        query.height = { $eq: Number(height) };
      }
    }

    const people = await PersonModel.find(query);

    res.status(200).json({ data: people });
  } catch (error) {
    console.error(
      "Error al obtener los personajes de la base de datos:",
      error
    );
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

    const createdPeople: IPerson[] = [];
    const repeatedPeople: IPerson[] = [];

    for (const personData of people) {
      const urlParts = personData.url.split("/");
      const apiId = parseInt(urlParts[urlParts.length - 2], 10);

      const existingPerson = await PersonModel.findOne({
        apiId,
      });

      const heightAsNumber = isNaN(Number(personData.height))
        ? null
        : Number(personData.height);

      if (existingPerson) {
        repeatedPeople.push(existingPerson.toObject());
      } else {
        const person = new PersonModel({
          ...personData,
          apiId,
          height: heightAsNumber,
        });
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

export const getPersonByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const person = await PersonModel.findById(id);

    if (!person) {
      res.status(404).json({ message: "Person not found" });
      return;
    }

    res.status(200).json(person);
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(500).json({ message: "Error fetching person" });
  }
};
