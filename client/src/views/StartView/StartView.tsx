import decoImage from "../../assets/decorative_image.jpg";
import starshipImage from "../../assets/starship.webp";
import { Link } from "react-router-dom";
import style from "./StartView.module.css";
import { useEffect } from "react";

const StartView = () => {
  return (
    <div className={style.App}>
      <header className={style.AppHeader}>
        <div className={style.ContentWrapper}>
          <div className={style.ImageContainer}>
            <img
              src={decoImage}
              alt="Decorative"
              className={style.DecorativeImage}
            />
          </div>
          <div className={style.TextContainer}>
            <img src={starshipImage} className={style.AppLogo} alt="logo" />
            <h1 className={style.Title}>StarWarsExplorer</h1>
            <p className={style.Description}>Informacion guía</p>
            <Link to={"/Home"}>
              <p className={style.ExploreButton}>Explorar</p>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default StartView;
