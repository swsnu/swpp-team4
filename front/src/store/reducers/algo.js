
const initialState = {
  algorithmList: [],
};

const algoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    default:
      break;
  }
  return state;
};

export default algoReducer;
