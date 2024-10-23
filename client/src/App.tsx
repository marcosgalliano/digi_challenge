import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./redux/store";
import {
  getAllPeople,
  getAllFilms,
  getAllPlanets,
  getAllStarships,
} from "./redux/actions";

// Views y Components
import StartView from "./views/StartView/StartView";
import Home from "./views/Home/Home";
import Header from "./components/Header/Header";
import Personajes from "./views/Personajes/Personajes";
import Planetas from "./views/Planets/Planetas";
import Naves from "./views/Starships/Naves";
import Films from "./views/Films/Films";
import DetailPersonajes from "./views/Detail/Personajes/Detailpersonajes";
import DetailPlanets from "./views/Detail/Planets/DetailPlanets";
import DetailFilms from "./views/Detail/Films/FilmsDetail";
import DetailStarship from "./views/Detail/DetailStarship/DetailStarship";

const App = () => {
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector((state: RootState) => state.people);

  useEffect(() => {
    dispatch(getAllPeople());
    dispatch(getAllFilms());
    dispatch(getAllPlanets());
    dispatch(getAllStarships());
  }, [dispatch]);

  return (
    <>
      {location.pathname !== "/" && <Header />}
      <Routes>
        <Route path="/" element={<StartView />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/personajes" element={<Personajes />} />
        <Route path="/planetas" element={<Planetas />} />
        <Route path="/naves" element={<Naves />} />
        <Route path="/peliculas" element={<Films />} />
        {/* DETAILS */}
        <Route path="/personajes/:id" element={<DetailPersonajes />} />
        <Route path="/planetas/:id" element={<DetailPlanets />} />
        <Route path="/films/:id" element={<DetailFilms />} />
        <Route path="/naves/:id" element={<DetailStarship />} />
      </Routes>
    </>
  );
};

export default App;
