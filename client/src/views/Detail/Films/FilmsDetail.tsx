import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./DetailFilms.module.css";

interface Character {
  name: string;
  url: string;
}

interface Planet {
  name: string;
  url: string;
}

interface Starship {
  name: string;
  url: string;
}

interface Vehicle {
  name: string;
  url: string;
}

interface FilmDetailProps {
  apiId?: number;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
}

const DetailFilms: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<FilmDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedCharacters, setRelatedCharacters] = useState<Character[]>([]);
  const [relatedPlanets, setRelatedPlanets] = useState<Planet[]>([]);
  const [relatedStarships, setRelatedStarships] = useState<Starship[]>([]);
  const [relatedVehicles, setRelatedVehicles] = useState<Vehicle[]>([]);

  const characters = useSelector((state: RootState) => state.people);
  const planets = useSelector((state: RootState) => state.planets);
  const starships = useSelector((state: RootState) => state.starships);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `https://digi-challenge.onrender.com/api/films/${id}`
        );
        const data = response.data;

        const filteredData: FilmDetailProps = {
          apiId: data.apiId,
          title: data.title,
          episode_id: data.episode_id,
          opening_crawl: data.opening_crawl,
          director: data.director,
          producer: data.producer,
          release_date: data.release_date,
          characters: data.characters,
          planets: data.planets,
          starships: data.starships,
          vehicles: data.vehicles,
        };

        setDetail(filteredData);
        setLoading(false);

        if (data.characters) {
          fetchRelatedItems<Character>(
            data.characters,
            setRelatedCharacters,
            "name"
          );
        }
        if (data.planets) {
          fetchRelatedItems<Planet>(data.planets, setRelatedPlanets, "name");
        }
        if (data.starships) {
          fetchRelatedItems<Starship>(
            data.starships,
            setRelatedStarships,
            "name"
          );
        }
        if (data.vehicles) {
          fetchRelatedItems<Vehicle>(data.vehicles, setRelatedVehicles, "name");
        }
      } catch (error) {
        console.error("Error fetching film details:", error);
        setError("Error al obtener los detalles de la película.");
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
        if (type === "Personajes relacionados") {
          return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
        } else if (type === "Planetas relacionados") {
          return `https://starwars-visualguide.com/assets/img/planets/${id}.jpg`;
        } else if (type === "Naves relacionadas") {
          return `https://starwars-visualguide.com/assets/img/starships/${id}.jpg`;
        } else if (type === "Vehículos relacionados") {
          return `https://starwars-visualguide.com/assets/img/vehicles/${id}.jpg`;
        }
      }
      return null;
    };

    const getInternalLink = (url: string, type: string) => {
      const id = url.match(/\/(\d+)\/$/)?.[1];
      if (!id) return "#";

      if (type === "Personajes relacionados") {
        const character = characters.find(
          (char) => char.apiId === parseInt(id)
        );
        return character ? `/personajes/${character._id}` : "#";
      } else if (type === "Planetas relacionados") {
        const planet = planets.find((planet) => planet.apiId === parseInt(id));
        return planet ? `/planetas/${planet._id}` : "#";
      } else if (type === "Naves relacionadas") {
        const starship = starships.find((ship) => ship.apiId === parseInt(id));
        return starship ? `/naves/${starship._id}` : "#";
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
              src={`https://starwars-visualguide.com/assets/img/films/${detail.apiId}.jpg`}
              alt={detail.title}
              className={styles.filmImage}
            />
            <div className={styles.filmInfo}>
              <h1>{detail.title}</h1>
              <p>Episode: {detail.episode_id}</p>
              <p>Director: {detail.director}</p>
              <p>Producer: {detail.producer}</p>
              <p>
                Release Date: {new Date(detail.release_date).toDateString()}
              </p>
              <p>{detail.opening_crawl}</p>
            </div>
          </div>
          <div className={styles.relatedSection}>
            {renderLinkedItems(relatedCharacters, "Personajes relacionados")}
            {renderLinkedItems(relatedPlanets, "Planetas relacionados")}
            {renderLinkedItems(relatedStarships, "Naves relacionadas")}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailFilms;
