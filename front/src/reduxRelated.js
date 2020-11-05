import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer from './store/reducers/user';

export const history = createBrowserHistory();
export const middlewares = [thunk, routerMiddleware(history)];

const rootReducer = combineReducers({
  user: userReducer,
  router: connectRouter(history),
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(...middlewares),
  ),
);

