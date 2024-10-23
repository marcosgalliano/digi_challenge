import { Request, Response } from "express";
import { fetchFilms } from "../controllers/filmsController";
import FilmModel, { IFilm } from "../models/FilmModel";
import { FilmQuery } from "../types";

export const getFilmsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, release_date } = req.query;

    const query: FilmQuery = {};

    if (title) {
      query.title = { $regex: new RegExp(title as string, "i") };
    }

    if (release_date) {
      const operator = (release_date as string).charAt(0);
      const yearValue = (release_date as string).slice(1);

      const parsedYear = parseInt(yearValue, 10);

      if (!isNaN(parsedYear)) {
        const startDate = new Date(`${parsedYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${parsedYear}-12-31T23:59:59.999Z`);

        switch (operator) {
          case "<":
            query.release_date = { $lt: startDate };
            break;
          case ">":
            query.release_date = { $gt: endDate };
            break;
          case "<=":
            query.release_date = { $lte: endDate };
            break;
          case ">=":
            query.release_date = { $gte: startDate };
            break;
          default:
            break;
        }
      }
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

export const getFilmByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const film = await FilmModel.findById(id);

    if (!film) {
      res.status(404).json({ message: "Film not found" });
      return;
    }

    res.status(200).json(film);
  } catch (error) {
    console.error("Error fetching film:", error);
    res.status(500).json({ message: "Error fetching film" });
  }
};
