import axios, { AxiosResponse } from "axios";
import { Planets } from "../types";
import { PlanetsApiResponse } from "../types";

export const fetchPlanets = async (): Promise<Planets[]> => {
  let allPlanets: Planets[] = [];
  let nextUrl: string | null = "https://swapi.dev/api/planets/";

  while (nextUrl) {
    const response: AxiosResponse<PlanetsApiResponse> = await axios.get(
      nextUrl
    );
    allPlanets = [...allPlanets, ...response.data.results];

    nextUrl = response.data.next;
  }

  return allPlanets;
};
