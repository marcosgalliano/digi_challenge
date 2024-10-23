import { createStore, applyMiddleware, compose } from "redux";
import { ThunkDispatch, thunk } from "redux-thunk";
import { useDispatch } from "react-redux";
import rootReducer from "./reducer";
import { Action } from "./actions";

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<RootState, void, Action>;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
