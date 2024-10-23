import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <h1>Bienvenido a StarWarsExplorer</h1>
      <div className={styles.sections}>
        <Link to="/personajes" className={styles.sectionLink}>
          <div className={styles.card}>
            <img
              src="https://www.elsoldehermosillo.com.mx/doble-via/e7emq9-star-wars/ALTERNATES/LANDSCAPE_960/Star%20Wars"
              alt="Characters"
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2>Personajes</h2>
              <p>Tus personajes favoritos de Star Wars</p>
            </div>
          </div>
        </Link>

        <Link to="/planetas" className={styles.sectionLink}>
          <div className={styles.card}>
            <img
              src="https://lafuerzanoticias.wordpress.com/wp-content/uploads/2018/10/mustafar-tall.jpg?w=1536&h=768&crop=1"
              alt="Planets"
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2>Planetas</h2>
              <p>Asombrosos planetas de la galaxia</p>
            </div>
          </div>
        </Link>

        <Link to="/naves" className={styles.sectionLink}>
          <div className={styles.card}>
            <img
              src="https://i.blogs.es/e8942b/millennium-falcon/450_1000.jpg"
              alt="Starships"
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2>Naves</h2>
              <p>Icónicas naves del universo Star Wars</p>
            </div>
          </div>
        </Link>

        <Link to="/peliculas" className={styles.sectionLink}>
          <div className={styles.card}>
            <img
              src="https://i.blogs.es/2cc78a/ordenstarwars/1366_2000.jpg"
              alt="Films"
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <h2>Películas</h2>
              <p>Revive las épicas películas</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
