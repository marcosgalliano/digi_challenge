import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getAllPlanets } from "../../redux/actions";
import Card from "../../components/Card/Card";
import styles from "./Planetas.module.css";
import axios from "axios";

interface Planet {
  _id: string;
  name: string;
  climate: string;
  population: number;
  apiId: number;
}

const ITEMS_PER_PAGE = 8;

const Planetas: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const planets = useSelector((state: RootState) => state.planets as Planet[]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [operator, setOperator] = useState<string>("<");
  const [populationFilter, setPopulationFilter] = useState<string>("");
  const [filteredPlanets, setFilteredPlanets] = useState<Planet[]>(planets);

  const totalPages = Math.ceil(filteredPlanets.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(getAllPlanets());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.length < 3 && populationFilter === "") {
      setFilteredPlanets(planets);
    }
  }, [searchTerm, populationFilter, planets]);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      let query = `https://digi-challenge.onrender.com/api/planets?`;

      if (searchTerm.length >= 3) {
        query += `name=${searchTerm}&`;
      }

      if (populationFilter) {
        query += `population=${operator}${populationFilter}`;
      }

      const response = await axios.get(query);
      setFilteredPlanets(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOperator("<");
    setPopulationFilter("");
    dispatch(getAllPlanets());
  };

  const getCurrentPageData = (): Planet[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPlanets.slice(startIndex, endIndex);
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
    <div className={styles.planetas}>
      <h1>Planetas</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar planeta..."
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
          type="number"
          placeholder={handlePlaceholder()}
          value={populationFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseInt(value, 10) >= 1) {
              setPopulationFilter(value);
            }
          }}
          className={styles.populationInput}
        />
        <span>habitantes</span>
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
        {filteredPlanets.length === 0 ? (
          <p>No hay resultados.</p>
        ) : (
          getCurrentPageData().map((planet) => (
            <Card
              key={planet.name}
              title={planet.name}
              description={`Poblacion: ${planet.population}`}
              imageUrl={`https://starwars-visualguide.com/assets/img/planets/${planet.apiId}.jpg`}
              linkTo={`/planetas/${planet._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Planetas;
