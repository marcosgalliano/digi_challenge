import { Router } from "express";
import { getFilmsHandler, saveFilmsHandler } from "../handlers/filmsHandler";
import {getStarshipsHandler, saveStarshipsHandler} from "../handlers/starshipsHandler";
import {getPlanetsHandler, savePlanetsHandler} from "../handlers/planetsHandler";
import { savePeopleHandler, getPeopleHandler } from "../handlers/peopleHandler";

const router = Router();

//people routes
router.get("/people", getPeopleHandler);
router.post("/people/save", savePeopleHandler);

//films routes
router.get("/films", getFilmsHandler);
router.post("/films/save", saveFilmsHandler);

//starships routes
router.get("/starships", getStarshipsHandler);
router.post("/starships/save", saveStarshipsHandler);

//planets routes
router.get("/planets", getPlanetsHandler);
router.post("/planets/save", savePlanetsHandler);

export default router;
