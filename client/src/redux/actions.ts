import axios from "axios";
import { Dispatch } from "redux";
import { ActionType } from "./actionTypes";
import { Person, Starships, Planets, Films } from "../react-app-env";

interface GetAllPeopleAction {
  type: ActionType.GET_ALL_PEOPLE;
  payload: Person[];
}

interface GetAllStarshipsAction {
  type: ActionType.GET_ALL_STARSHIPS;
  payload: Starships[];
}

interface GetAllPlanetsAction {
  type: ActionType.GET_ALL_PLANETS;
  payload: Planets[];
}

interface GetAllFilmsAction {
  type: ActionType.GET_ALL_FILMS;
  payload: Films[];
}
export type Action =
  | GetAllPeopleAction
  | GetAllStarshipsAction
  | GetAllPlanetsAction
  | GetAllFilmsAction;

export const getAllPeople = () => {
  return async (dispatch: Dispatch<GetAllPeopleAction>) => {
    const response = await axios.get(
      "https://digi-challenge.onrender.com/api/people"
    );
    dispatch({
      type: ActionType.GET_ALL_PEOPLE,
      payload: response.data.data,
    });
  };
};

export const getAllStarships = () => {
  return async (dispatch: Dispatch<GetAllStarshipsAction>) => {
    const response = await axios.get(
      "https://digi-challenge.onrender.com/api/starships"
    );

    console.log(response);
    
    dispatch({
      type: ActionType.GET_ALL_STARSHIPS,
      payload: response.data.data,
    });
  };
};

export const getAllPlanets = () => {
  return async (dispatch: Dispatch<GetAllPlanetsAction>) => {
    const response = await axios.get(
      "https://digi-challenge.onrender.com/api/planets"
    );
    dispatch({
      type: ActionType.GET_ALL_PLANETS,
      payload: response.data.data,
    });
  };
};

export const getAllFilms = () => {
  return async (dispatch: Dispatch<GetAllFilmsAction>) => {
    const response = await axios.get(
      "https://digi-challenge.onrender.com/api/films"
    );
    dispatch({
      type: ActionType.GET_ALL_FILMS,
      payload: response.data.data,
    });
  };
};
