import * as actionTypes from '../actions/actionTypes';

const initialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: true,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    case actionTypes.SIGN_IN:
      return { ...state, userInfo: action.userInfo, loggedIn: action.loggedIn };
    default:
      break;
  }
  return state;
};

export default userReducer;
