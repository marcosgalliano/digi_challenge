import axios, { AxiosResponse } from "axios";
import { Person } from "../types";
import { PeopleApiResponse } from "../types";

export const fetchPeople = async (): Promise<Person[]> => {
  let allPeople: Person[] = [];
  let nextUrl: string | null = "https://swapi.dev/api/people/";

  while (nextUrl) {
    const response: AxiosResponse<PeopleApiResponse> = await axios.get(nextUrl);

    allPeople = [...allPeople, ...response.data.results];

    nextUrl = response.data.next;
  }

  return allPeople;
};
