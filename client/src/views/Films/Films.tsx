import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getAllFilms } from "../../redux/actions";
import Card from "../../components/Card/Card";
import styles from "./Films.module.css";
import axios from "axios";

interface Film {
  _id: string;
  title: string;
  director: string;
  apiId: number;
  release_date: string;
}

const ITEMS_PER_PAGE = 8;

const Films: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const films = useSelector((state: RootState) => state.films as Film[]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [operator, setOperator] = useState<string>("<");
  const [releaseDateFilter, setReleaseDateFilter] = useState<string>("");
  const [filteredFilms, setFilteredFilms] = useState<Film[]>(films);

  const totalPages = Math.ceil(filteredFilms.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(getAllFilms());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.length < 3 && releaseDateFilter === "") {
      setFilteredFilms(films);
    }
  }, [searchTerm, releaseDateFilter, films]);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      let query = `https://digi-challenge.onrender.com/api/films?`;

      if (searchTerm.length >= 3) {
        query += `title=${searchTerm}&`;
      }

      if (releaseDateFilter) {
        query += `release_date=${operator}${releaseDateFilter}`;
      }

      const response = await axios.get(query);
      setFilteredFilms(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOperator("<");
    setReleaseDateFilter("");
    dispatch(getAllFilms());
  };

  const getCurrentPageData = (): Film[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFilms.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePlaceholder = () => {
    switch (operator) {
      case "<":
        return "(Menos que)";
      case "<=":
        return "(Menos o igual que)";
      case ">":
        return "(Mas que)";
      case ">=":
        return "(Mas o igal que)";
      default:
        break;
    }
  };

  return (
    <div className={styles.films}>
      <h1>Películas</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar película..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <p>Min. 3 caracteres</p>
      </div>

      <div className={styles.filterContainer}>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className={styles.operatorSelect}
        >
          <option value="<">&lt;</option>
          <option value=">">&gt;</option>
          <option value="<=">&lt;=</option>
          <option value=">=">&gt;=</option>
        </select>

        <input
          type="text"
          placeholder={handlePlaceholder()}
          value={releaseDateFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setReleaseDateFilter(value);
            }
          }}
          className={styles.releaseDateInput}
        />
        <span>año</span>
        <button onClick={handleSearch} className={styles.filterButton}>
          Filtrar
        </button>
        <div className={styles.divDeleteFilters}>
          <button onClick={clearFilters} className={styles.clearButton}>
            Eliminar Filtros
          </button>
        </div>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={styles.desktopOnly}
        >
          Primera
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 5)}
          disabled={currentPage <= 5}
          className={styles.desktopOnly}
        >
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"} Anterior
        </button>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente {">"}
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 5)}
          disabled={currentPage + 5 > totalPages}
          className={styles.desktopOnly}
        >
          {">>"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={styles.desktopOnly}
        >
          Última
        </button>
      </div>

      <div className={styles.cardsContainer}>
        {filteredFilms.length === 0 ? (
          <p>No hay resultados.</p>
        ) : (
          getCurrentPageData().map((film) => (
            <Card
              key={film.title}
              title={film.title}
              description={`Año: ${film.release_date.slice(0, 10)}`}
              imageUrl={`https://starwars-visualguide.com/assets/img/films/${film.apiId}.jpg`}
              linkTo={`/films/${film._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Films;
