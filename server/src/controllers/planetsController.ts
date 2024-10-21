import axios from "axios";
import { Planets } from "../types";

export const fetchPlanets = async (): Promise<Planets[]> => {
  const response = await axios.get("https://swapi.dev/api/planets/");
  return response.data.results;
};
