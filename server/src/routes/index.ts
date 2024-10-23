import { Router } from "express";
import {
  getFilmsHandler,
  getFilmByIdHandler,
  saveFilmsHandler,
} from "../handlers/filmsHandler";
import {
  getStarshipsHandler,
  getStarshipByIdHandler,
  saveStarshipsHandler,
} from "../handlers/starshipsHandler";
import {
  getPlanetsHandler,
  getPlanetByIdHandler,
  savePlanetsHandler,
} from "../handlers/planetsHandler";
import {
  getPeopleHandler,
  getPersonByIdHandler,
  savePeopleHandler,
} from "../handlers/peopleHandler";

const router = Router();

// People routes
router.get("/people", getPeopleHandler);
router.get("/people/:id", getPersonByIdHandler);
router.post("/people/save", savePeopleHandler);

// Films routes
router.get("/films", getFilmsHandler);
router.get("/films/:id", getFilmByIdHandler);
router.post("/films/save", saveFilmsHandler);

// Starships routes
router.get("/starships", getStarshipsHandler);
router.get("/starships/:id", getStarshipByIdHandler);
router.post("/starships/save", saveStarshipsHandler);

// Planets routes
router.get("/planets", getPlanetsHandler);
router.get("/planets/:id", getPlanetByIdHandler);
router.post("/planets/save", savePlanetsHandler);

export default router;
