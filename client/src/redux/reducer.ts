import { ActionType } from "./actionTypes";
import { Action } from "./actions";
import { Person, Starships, Planets, Films } from "../react-app-env";

interface State {
  people: Person[];
  starships: Starships[];
  planets: Planets[];
  films: Films[];
}

const initialState: State = {
  people: [],
  starships: [],
  planets: [],
  films: [],
};

const rootReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.GET_ALL_PEOPLE:
      return { ...state, people: action.payload };
    case ActionType.GET_ALL_STARSHIPS:
      return { ...state, starships: action.payload };
    case ActionType.GET_ALL_PLANETS:
      return { ...state, planets: action.payload };
    case ActionType.GET_ALL_FILMS:
      return { ...state, films: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
