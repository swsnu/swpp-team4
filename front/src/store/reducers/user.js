const initialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    default:
      return initialState;
  }
};

export default userReducer;
