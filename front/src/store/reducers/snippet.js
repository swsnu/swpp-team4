import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const initialState = {
  ownedSnippetList: [],
  likedSnippetList: [],
  sharedSnippetList: [],
};

const snippetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    case 'GET_OWNED_SNIPPET':
      return {
        ownedSnippetList: action.data,
        likedSnippetList: state.likedSnippetList,
      };
    case 'ADD_OWNED_SNIPPET':
      return {
        ownedSnippetList: [...state.ownedSnippetList, action.data.code],
        likedSnippetList: state.likedSnippetList,
      };
    case 'LIKE_SNIPPET':
      return {
        ...state,
        likedSnippetList: [...state.likedSnippetList, action.data],
      };
    case 'UNLIKE_SNIPPET':
      const newLikeList = state.likedSnippetList.filter((snippet) => {
        return snippet.id !== action.data.id;
      });
      return {
        ...state,
        likedSnippetList: newLikeList,
      };
    case 'GET_LIKED_SNIPPET':
      return {
        ownedSnippetList: state.ownedSnippetList,
        likedSnippetList: action.data,
      };
    case 'ADD_SHARED_SNIPPET':
      return {
        ...state,
        sharedSnippetList: [...state.sharedSnippetList, action.data],
      };
    case 'DELETE_SHARED_SNIPPET':
      const newList = state.sharedSnippetList.filter((snippet) => {
        return snippet.id !== action.data.id;
      });
      return {
        ...state,
        sharedSnippetList: newList,
      };
    default:
      break;
  }
  return state;
};

export default snippetReducer;
