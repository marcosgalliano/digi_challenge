import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./DetailPlanets.module.css";

interface Film {
  title: string;
  url: string;
}

interface Resident {
  name: string;
  url: string;
}

interface PlanetDetailProps {
  apiId?: number;
  name: string;
  rotation_period?: string;
  orbital_period?: string;
  diameter?: string;
  climate?: string;
  gravity?: string;
  terrain?: string;
  surface_water?: string;
  population?: number;
  residents?: string[];
  films?: string[];
}

const DetailPlanets: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<PlanetDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedFilms, setRelatedFilms] = useState<Film[]>([]);
  const [relatedResidents, setRelatedResidents] = useState<Resident[]>([]);

  const films = useSelector((state: RootState) => state.films);
  const people = useSelector((state: RootState) => state.people);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `https://digi-challenge.onrender.com/api/planets/${id}`
        );
        const data = response.data;

        const filteredData: PlanetDetailProps = {
          apiId: data.apiId,
          name: data.name,
          rotation_period: data.rotation_period,
          orbital_period: data.orbital_period,
          diameter: data.diameter,
          climate: data.climate,
          gravity: data.gravity,
          terrain: data.terrain,
          surface_water: data.surface_water,
          population: data.population,
          residents: data.residents,
          films: data.films,
        };

        setDetail(filteredData);
        setLoading(false);

        if (data.films) {
          fetchRelatedItems<Film>(data.films, setRelatedFilms, "title");
        }
        if (data.residents) {
          fetchRelatedItems<Resident>(
            data.residents,
            setRelatedResidents,
            "name"
          );
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        setError("Error al obtener el detalle.");
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
        if (type === "Peliculas relacionadas") {
          return `https://starwars-visualguide.com/assets/img/films/${id}.jpg`;
        } else if (type === "Residentes relacionados") {
          return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
        }
      }
      return null;
    };

    const getInternalLink = (url: string, type: string) => {
      const id = url.match(/\/(\d+)\/$/)?.[1];
      if (!id) return "#";

      if (type === "Peliculas relacionadas") {
        const film = films.find((film) => film.apiId === parseInt(id));
        return film ? `/films/${film._id}` : "#";
      } else if (type === "Residentes relacionados") {
        const person = people.find(
          (resident) => resident.apiId === parseInt(id)
        );
        return person ? `/personajes/${person._id}` : "#";
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
              src={`https://starwars-visualguide.com/assets/img/planets/${detail.apiId}.jpg`}
              alt={detail.name}
              className={styles.characterImage}
            />
            <div className={styles.planetInfo}>
              <h1>{detail.name}</h1>
              <p>Rotation Period: {detail.rotation_period}</p>
              <p>Orbital Period: {detail.orbital_period}</p>
              <p>Diameter: {detail.diameter} km</p>
              <p>Climate: {detail.climate}</p>
              <p>Gravity: {detail.gravity}</p>
              <p>Terrain: {detail.terrain}</p>
              <p>Surface Water: {detail.surface_water}%</p>
              <p>Population: {detail.population?.toLocaleString()}</p>
            </div>
          </div>

          <div className={styles.relatedSection}>
            {renderLinkedItems(relatedFilms, "Peliculas relacionadas")}
            {renderLinkedItems(relatedResidents, "Residentes relacionados")}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPlanets;
