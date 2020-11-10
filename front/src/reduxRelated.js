import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import userReducer from "./store/reducers/user";
import algoReducer from "./store/reducers/algo";

export const history = createBrowserHistory();

const logger = (store) => {
  return (next) => {
    return (action) => {
      console.log("[Middleware] Dispatching", action);
      const result = next(action);
      console.log("[Middleware] Next State", store.getState());
      return result;
    };
  };
};

export const middlewares = [logger, thunk, routerMiddleware(history)];

const rootReducer = combineReducers({
  user: userReducer,
  algo: algoReducer,
  router: connectRouter(history)
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(...middlewares)
  )
);

