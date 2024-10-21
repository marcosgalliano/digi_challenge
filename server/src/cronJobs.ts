import cron from "node-cron";
import axios from "axios";

const getCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString();
};

export const saveDataCronJob = async () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const peopleResponse = await axios.post(
        "http://localhost:3001/api/people/save"
      );
      const { createdPeople, repeatedPeople } = peopleResponse.data;
      console.log(
        `[${getCurrentDateTime()}] Información de personajes guardada. Nuevos: ${
          createdPeople.length
        }, Repetidos: ${repeatedPeople.length}`
      );

      const starshipsResponse = await axios.post(
        "http://localhost:3001/api/starships/save"
      );
      const { createdProducts, repeatedProducts } = starshipsResponse.data;
      console.log(
        `[${getCurrentDateTime()}] Información de naves estelares guardada. Nuevos: ${
          createdProducts.length
        }, Repetidos: ${repeatedProducts.length}`
      );

      const planetsResponse = await axios.post(
        "http://localhost:3001/api/planets/save"
      );
      const { createdPlanets, repeatedPlanets } = planetsResponse.data;
      console.log(
        `[${getCurrentDateTime()}] Información de planetas guardada. Nuevos: ${
          createdPlanets.length
        }, Repetidos: ${repeatedPlanets.length}`
      );

      const filmsResponse = await axios.post(
        "http://localhost:3001/api/films/save"
      );
      const { createdFilms, repeatedFilms } = filmsResponse.data;
      console.log(
        `[${getCurrentDateTime()}] Información de películas guardada. Nuevos: ${
          createdFilms.length
        }, Repetidos: ${repeatedFilms.length}`
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `[${getCurrentDateTime()}] Error al ejecutar cron jobs:`,
          error.message
        );
      } else {
        console.error(`[${getCurrentDateTime()}] Error desconocido:`, error);
      }
    }
  });
};
