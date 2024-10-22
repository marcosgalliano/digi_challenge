import { Request, Response } from "express";
import { fetchFilms } from "../controllers/filmsController";
import FilmModel, { IFilm } from "../models/FilmModel";
import { FilmQuery } from "../types";

export const getFilmsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, director } = req.query;

    const query: FilmQuery = {};

    if (title) {
      query.title = { $regex: new RegExp(title as string, "i") };
    }

    if (director) {
      query.director = { $regex: new RegExp(director as string, "i") };
    }

    const films = await FilmModel.find(query);

    res.status(200).json({ data: films });
  } catch (error) {
    console.error("Error fetching films from database:", error);
    res.status(500).json({
      error: "Error al obtener las películas desde la base de datos.",
    });
  }
};

export const saveFilmsHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const films = await fetchFilms();

    const createdFilms: IFilm[] = [];
    const repeatedFilms: IFilm[] = [];

    for (const filmData of films) {
      const urlParts = filmData.url.split("/");
      const apiId = parseInt(urlParts[urlParts.length - 2], 10);

      const existingFilm = await FilmModel.findOne({
        apiId: apiId,
      });

      if (existingFilm) {
        repeatedFilms.push(existingFilm.toObject());
      } else {
        const film = new FilmModel({
          ...filmData,
          apiId: apiId,
        });
        const savedFilm = await film.save();
        createdFilms.push(savedFilm.toObject());
      }
    }

    res.status(200).json({
      message: "Proceso de guardado completado.",
      createdFilms,
      repeatedFilms,
    });
  } catch (error) {
    console.error("Error al guardar los films:", error);
    res.status(500).json({
      error: "Error al guardar los films en la base de datos.",
    });
  }
};
