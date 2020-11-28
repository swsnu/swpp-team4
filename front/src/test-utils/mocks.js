import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';
import { middlewares } from '../reduxRelated';
import { history } from '../reduxRelated';

const getMockTodoReducer = jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break;
    }
    return state;
  },
);

export const getMockStore = (
  initialStateUser,
  initialStateAlgo = {},
  initialStateSnippet = {},
  initialStateEditor = {},
) => {
  const rootReducer = combineReducers({
    user: getMockTodoReducer(initialStateUser),
    algo: getMockTodoReducer(initialStateAlgo),
    snippet: getMockTodoReducer(initialStateSnippet),
    editor: getMockTodoReducer(initialStateEditor),
    router: connectRouter(history),
  });
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  return mockStore;
};
