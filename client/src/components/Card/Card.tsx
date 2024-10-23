import React, { useState } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  linkTo: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  linkTo,
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);

  const handleImageError = () => {
    setImgSrc(
      "https://img.freepik.com/vector-premium/diseno-vectorial-diseno-pagina-error-isometrico-404-pagina-que-solicito-no-pudo-encontrar-concepto-creativo-pagina-404-sitio-web-sitio-web-construccion_589019-3762.jpg?w=360"
    );
  };

  return (
    <div className={styles.card}>
      <img
        src={imgSrc}
        alt={title}
        className={styles.cardImage}
        onError={handleImageError} 
      />
      <div className={styles.cardContent}>
        <h2>{title}</h2>
        <p>{description}</p>
        <a href={linkTo} className={styles.cardLink}>
          Ver más
        </a>
      </div>
    </div>
  );
};

export default Card;
