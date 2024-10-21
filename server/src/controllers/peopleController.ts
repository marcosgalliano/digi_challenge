import axios from "axios";
import { Person } from "../types";

export const fetchPeople = async (): Promise<Person[]> => {
  const response = await axios.get("https://swapi.dev/api/people/");
  return response.data.results;
};
