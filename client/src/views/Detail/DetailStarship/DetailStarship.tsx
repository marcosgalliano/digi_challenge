import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./DetailStarship.module.css";

interface Pilot {
  name: string;
  url: string;
}

interface Film {
  title: string;
  url: string;
}

interface StarshipDetailProps {
  apiId?: number;
  name: string;
  starshipModel: string;
  manufacturer: string;
  cost_in_credits: number;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
}

const DetailStarship: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<StarshipDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPilots, setRelatedPilots] = useState<Pilot[]>([]);
  const [relatedFilms, setRelatedFilms] = useState<Film[]>([]);

  const pilots = useSelector((state: RootState) => state.people);
  const films = useSelector((state: RootState) => state.films);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `https://digi-challenge.onrender.com/api/starships/${id}`
        );
        const data = response.data;

        const filteredData: StarshipDetailProps = {
          apiId: data.apiId,
          name: data.name,
          starshipModel: data.starshipModel,
          manufacturer: data.manufacturer,
          cost_in_credits: data.cost_in_credits,
          length: data.length,
          max_atmosphering_speed: data.max_atmosphering_speed,
          crew: data.crew,
          passengers: data.passengers,
          cargo_capacity: data.cargo_capacity,
          consumables: data.consumables,
          hyperdrive_rating: data.hyperdrive_rating,
          MGLT: data.MGLT,
          starship_class: data.starship_class,
          pilots: data.pilots,
          films: data.films,
        };

        setDetail(filteredData);
        setLoading(false);

        if (data.pilots) {
          fetchRelatedItems<Pilot>(data.pilots, setRelatedPilots, "name");
        }
        if (data.films) {
          fetchRelatedItems<Film>(data.films, setRelatedFilms, "title");
        }
      } catch (error) {
        console.error("Error fetching starship details:", error);
        setError("Error al obtener los detalles de la nave.");
        setLoading(false);
      }
    };

    const fetchRelatedItems = async <T extends { url: string }>(
      urls: string[],
      setState: React.Dispatch<React.SetStateAction<T[]>>,
      field: keyof T
    ) => {
      try {
        const requests = urls.map((url) => axios.get(url));
        const responses = await Promise.all(requests);
        const items = responses.map(
          (response) =>
            ({
              url: response.data.url,
              [field]: response.data[field],
            } as T)
        );
        setState(items);
      } catch (error) {
        console.error("Error fetching related items:", error);
      }
    };

    fetchDetail();
  }, [id]);

  const renderLinkedItems = (
    items: { url: string; name?: string; title?: string }[],
    type: string
  ) => {
    const getImageUrl = (url: string, type: string) => {
      const id = url.match(/\/(\d+)\/$/)?.[1];
      if (id) {
        if (type === "Pilotos relacionados") {
          return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
        } else if (type === "Peliculas relacionadas") {
          return `https://starwars-visualguide.com/assets/img/films/${id}.jpg`;
        }
      }
      return null;
    };

    const getInternalLink = (url: string, type: string) => {
      const id = url.match(/\/(\d+)\/$/)?.[1];
      if (!id) return "#";

      if (type === "Pilotos relacionados") {
        const pilot = pilots.find((pilot) => pilot.apiId === parseInt(id));
        return pilot ? `/personajes/${pilot._id}` : "#";
      } else if (type === "Peliculas relacionadas") {
        const film = films.find((film) => film.apiId === parseInt(id));
        return film ? `/films/${film._id}` : "#";
      }
      return "#";
    };

    if (items && items.length > 0) {
      return (
        <div className={styles.linkedItems}>
          <h3>{type}</h3>
          <ul className={styles.linkedItemList}>
            {items.map((item, index) => (
              <li key={index} className={styles.linkedItem}>
                <Link to={getInternalLink(item.url, type)}>
                  {getImageUrl(item.url, type) && (
                    <img
                      src={getImageUrl(item.url, type)!}
                      alt={item.title || item.name}
                      className={styles.relatedImage}
                    />
                  )}
                  <p>{item.title || item.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className={styles.loader}>Cargando...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles.detail}>
      {detail && (
        <>
          <div className={styles.topSection}>
            <img
              src={`https://starwars-visualguide.com/assets/img/starships/${detail.apiId}.jpg`}
              alt={detail.name}
              className={styles.starshipImage}
            />
            <div className={styles.starshipInfo}>
              <h1>{detail.name}</h1>
              <p>Modelo: {detail.starshipModel}</p>
              <p>Fabricante: {detail.manufacturer}</p>
              <p>Costo en créditos: {detail.cost_in_credits}</p>
              <p>Longitud: {detail.length}m</p>
              <p>
                Velocidad máxima en atmósfera: {detail.max_atmosphering_speed}
              </p>
              <p>Crew: {detail.crew}</p>
              <p>Pasajeros: {detail.passengers}</p>
              <p>Capacidad de carga: {detail.cargo_capacity}</p>
              <p>Consumibles: {detail.consumables}</p>
              <p>Calificación de hiperimpulso: {detail.hyperdrive_rating}</p>
              <p>MGLT: {detail.MGLT}</p>
              <p>Clase de nave: {detail.starship_class}</p>
            </div>
          </div>
          <div className={styles.relatedSection}>
            {renderLinkedItems(relatedPilots, "Pilotos relacionados")}
            {renderLinkedItems(relatedFilms, "Peliculas relacionadas")}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailStarship;
