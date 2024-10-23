import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { getAllPeople } from "../../redux/actions";
import Card from "../../components/Card/Card";
import styles from "./Personajes.module.css";
import axios from "axios";

const ITEMS_PER_PAGE = 8;

const Personajes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const people = useSelector((state: RootState) => state.people);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [operator, setOperator] = useState("<");
  const [heightFilter, setHeightFilter] = useState("");
  const [filteredPeople, setFilteredPeople] = useState(people);
  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(getAllPeople());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.length < 3 && heightFilter === "") {
      setFilteredPeople(people);
    }
  }, [searchTerm, heightFilter, people]);

  const handleSearch = async () => {
    try {
      setCurrentPage(1);
      let query = `https://digi-challenge.onrender.com/api/people?`;

      if (searchTerm.length >= 3) {
        query += `name=${searchTerm}&`;
      }

      if (heightFilter) {
        query += `height=${operator}${heightFilter}`;
      }

      const response = await axios.get(query);
      setFilteredPeople(response.data.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setOperator("<");
    setHeightFilter("");
    dispatch(getAllPeople());
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPeople.slice(startIndex, endIndex);
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
    <div className={styles.personajes}>
      <h1>Personajes</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar personaje..."
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
          value={heightFilter}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || parseInt(value, 10) >= 1) {
              setHeightFilter(value);
            }
          }}
          className={styles.heightInput}
        />
        <span>cm</span>
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
        {filteredPeople.length === 0 ? (
          <p>No hay resultados.</p>
        ) : (
          getCurrentPageData().map((person) => (
            <Card
              key={person.name}
              title={person.name}
              description={`Altura: ${person.height} cm`}
              imageUrl={`https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${person.apiId}.jpg`}
              linkTo={`/personajes/${person._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Personajes;
