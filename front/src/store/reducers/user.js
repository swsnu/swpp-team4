import * as actionTypes from '../actions/actionTypes';
import {submitSnippet} from "../actions/snippet";

const initialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
  snippetSubmit: {
    1: false,
    2: false,
    3: false,
    4: false,
  },
  algorithmSubmit: false
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    case actionTypes.SIGN_IN:
      return {...state, userInfo: action.userInfo, loggedIn: action.loggedIn};
    case 'SUBMIT_SNIPPET':
      return {...state, snippetSubmit: {...state.snippetSubmit, [action.data.index]: action.data.value}}
    case 'RESET_SUBMIT_SNIPPET':
      return {
        ...state,
        snippetSubmit: {
          1: false,
          2: false,
          3: false,
          4: false,
        }
      }
    case 'CHANGE_SUBMIT_ALGORITHM':
      return {...state, algorithmSubmit: action.data}
    default:
      break;
  }
  return state;
};

export default userReducer;
