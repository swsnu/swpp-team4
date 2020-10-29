const initialState = {
  todos: [],
  selectedTodo: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      console.log(state);
      return initialState;
    default:
      return initialState;
  }
};

export default reducer;
