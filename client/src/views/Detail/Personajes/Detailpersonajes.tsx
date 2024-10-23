import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import styles from "./Detailpersonajes.module.css";

interface Film {
  title: string;
  url: string;
}

interface Starship {
  name: string;
  url: string;
}

interface DetailProps {
  apiId?: number;
  name: string;
  height?: number;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  homeworld?: string;
  films?: string[];
  starships?: string[];
}

const DetailPersonajes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [homeworldName, setHomeworldName] = useState<string | null>(null);
  const [relatedFilms, setRelatedFilms] = useState<Film[]>([]);
  const [relatedStarships, setRelatedStarships] = useState<Starship[]>([]);

  const films = useSelector((state: RootState) => state.films);
  const starships = useSelector((state: RootState) => state.starships);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(
          `https://digi-challenge.onrender.com/api/people/${id}`
        );
        const data = response.data;

        const filteredData: DetailProps = {
          apiId: data.apiId,
          name: data.name,
          height: data.height,
          mass: data.mass,
          hair_color: data.hair_color,
          skin_color: data.skin_color,
          eye_color: data.eye_color,
          birth_year: data.birth_year,
          gender: data.gender,
          homeworld: data.homeworld,
          films: data.films,
          starships: data.starships,
        };

        setDetail(filteredData);
        setLoading(false);

        if (data.homeworld) {
          fetchHomeworldName(data.homeworld);
        }

        if (data.films) {
          fetchRelatedItems<Film>(data.films, setRelatedFilms, "title");
        }
        if (data.starships) {
          fetchRelatedItems<Starship>(
            data.starships,
            setRelatedStarships,
            "name"
          );
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        setError("Error al obtener el detalle.");
        setLoading(false);
      }
    };

    const fetchHomeworldName = async (url: string) => {
      try {
        const response = await axios.get(url);
        setHomeworldName(response.data.name);
      } catch (error) {
        console.error("Error fetching homeworld:", error);
        setHomeworldName("Unknown");
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
        } else if (type === "Naves relacionadas") {
          return `https://starwars-visualguide.com/assets/img/starships/${id}.jpg`;
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
              src={`https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${detail.apiId}.jpg`}
              alt={detail.name}
              className={styles.characterImage}
            />
            <div className={styles.characterInfo}>
              <h1>{detail.name}</h1>
              <p>Birth Year: {detail.birth_year}</p>
              <p>Species: Unknown</p>
              <p>Height: {detail.height}cm</p>
              <p>Mass: {detail.mass}kg</p>
              <p>Gender: {detail.gender}</p>
              <p>Hair Color: {detail.hair_color}</p>
              <p>Skin Color: {detail.skin_color}</p>
              <p>Eye Color: {detail.eye_color}</p>
              <p>
                Homeworld:{" "}
                <a
                  href={detail.homeworld}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {homeworldName || "Unknown"}
                </a>
              </p>
            </div>
          </div>

          <div className={styles.relatedSection}>
            {renderLinkedItems(relatedFilms, "Peliculas relacionadas")}
            {renderLinkedItems(relatedStarships, "Naves relacionadas")}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailPersonajes;
