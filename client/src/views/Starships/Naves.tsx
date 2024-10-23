import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getAllStarships } from "../../redux/actions";
import Card from "../../components/Card/Card";
import styles from "./Naves.module.css";
import axios from "axios";

interface Starship {
  _id: string;
  name: string;
  model: string;
  cost_in_credits: number;
  apiId: number;
}

const ITEMS_PER_PAGE = 8;

const Naves: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const starships = useSelector(
    (state: RootState) => state.starships as Starship[]
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [operator, setOperator] = useState<string>("<");
  const [costFilter, setCostFilter] = useState<string>("");
  const [filteredStarships, setFilteredStarships] =
    useState<Starship[]>(starships);

  const totalPages = Math.ceil(filteredStarships.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(getAllStarships());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.length < 3 && costFilter === "") {
      setFilteredStarships(starships);
    }
  }, [searchTerm, costFilter, starships]);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      let query = `https://digi-challenge.onrender.com/api/starships?`;

      if (searchTerm.length >= 3) {
        query += `name=${searchTerm}&`;
      }

      if (costFilter) {
        query += `cost_in_credits=${operator}${costFilter}`;
      }

      const response = await axios.get(query);
      setFilteredStarships(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOperator("<");
    setCostFilter("");
    dispatch(getAllStarships());
  };

  const getCurrentPageData = (): Starship[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStarships.slice(startIndex, endIndex);
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
    <div className={styles.naves}>
      <h1>Naves</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar nave..."
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
          value={costFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseInt(value, 10) >= 1) {
              setCostFilter(value);
            }
          }}
          className={styles.costInput}
        />
        <span>créditos</span>
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
        {filteredStarships.length === 0 ? (
          <p>No hay resultados.</p>
        ) : (
          getCurrentPageData().map((starship) => (
            <Card
              key={starship.name}
              title={starship.name}
              description={`Precio: C$${starship.cost_in_credits}`}
              imageUrl={`https://starwars-visualguide.com/assets/img/starships/${starship.apiId}.jpg`}
              linkTo={`/naves/${starship._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Naves;
