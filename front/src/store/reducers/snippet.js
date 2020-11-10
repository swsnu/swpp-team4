import * as actionTypes from '../actions/actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


const initialState = {
  ownedSnippetList: [],
  likedSnippetList: [],
};

const snippetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    case 'GET_OWNED_SNIPPET':
      console.log(state);
      return initialState;
    case 'ADD_OWNED_SNIPPET':
      return {
        ownedSnippetList: [...state.ownedSnippetList, action.data.code],
        likedSnippetList: state.likedSnippetList
      };
    default:
      break;
  }
  return state;
};

export default snippetReducer;
