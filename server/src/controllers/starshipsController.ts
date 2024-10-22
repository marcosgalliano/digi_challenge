import axios, { AxiosResponse } from "axios";
import { Starships } from "../types";
import { StarshipsApiResponse } from "../types";

export const fetchStarships = async (): Promise<Starships[]> => {
  let allStarships: Starships[] = [];
  let nextUrl: string | null = "https://swapi.dev/api/starships/";

  while (nextUrl) {
    const response: AxiosResponse<StarshipsApiResponse> = await axios.get(nextUrl);
    allStarships = [...allStarships, ...response.data.results];

    nextUrl = response.data.next;
  }

  return allStarships;
};
