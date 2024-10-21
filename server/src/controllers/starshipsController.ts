import axios from "axios";
import { Starships } from "../types";

export const fetchStarships = async (): Promise<Starships[]> => {
  const response = await axios.get("https://swapi.dev/api/starships/");
  return response.data.results;
};
