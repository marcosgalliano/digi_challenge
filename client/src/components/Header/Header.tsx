import { useState, useEffect, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import starhipImage from "../../assets/starship.webp";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleClickOutside = (event: Event) => {
    if (
      !event.target ||
      (!(event.target as HTMLElement).closest(".header") && menuOpen)
    ) {
      closeMenu();
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const getPathName = (path: string) => {
    const basePath = path.split("/")[1];
    const paths: { [key: string]: string } = {
      "Home": "Home",
      "personajes": "Personajes",
      "planetas": "Planetas",
      "peliculas": "Películas",
      "naves": "Naves",
    };
    
    return paths[basePath] || basePath;
  };

  const renderLinks = (links: { to: string; label: string }[]) => {
    return links.map((link) => (
      <li key={link.to}>
        <Link
          to={link.to}
          className={`link ${location.pathname === link.to ? "active" : ""}`}
          onClick={closeMenu}
        >
          {link.label}
        </Link>
      </li>
    ));
  };

  const mainLinks = [
    { to: "/Home", label: "Home" },
    { to: "/personajes", label: "Personajes" },
    { to: "/planetas", label: "Planetas" },
    { to: "/peliculas", label: "Películas" },
    { to: "/naves", label: "Naves" },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <img
          src={starhipImage}
          alt="Logo"
          className="logo"
        />
        <div className="menu-icon" onClick={toggleMenu}>
          <span>{getPathName(location.pathname)}</span>
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBars}
            className="menu-icon"
          />
        </div>
        <nav className="desktop-nav">
          <ul className="nav-links">{renderLinks(mainLinks)}</ul>
        </nav>
      </div>
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <div className="navegation">
          <ul>{renderLinks(mainLinks)}</ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
