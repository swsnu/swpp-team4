
const initialState = {
  ownedAlgorithmList: []
};

const algoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RESET":
      console.log(state);
      return initialState;
    case "GET_OWNED_ALGORITHM":
      return { ...state, ownedAlgorithmList: action.data };
    default:
      break;
  }
  return state;
};

export default algoReducer;
