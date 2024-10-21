import axios from "axios";
import { Films } from "../types";

export const fetchFilms = async (): Promise<Films[]> => {
  const response = await axios.get("https://swapi.dev/api/films/");
  return response.data.results;
};

