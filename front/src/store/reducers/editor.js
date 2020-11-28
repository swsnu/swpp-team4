const initialState = {
  loadedDraftName: '',
};

const editorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'LOAD_DRAFT_NAME':
      return { ...state, loadedDraftName: action.data };
    case 'DELETE_DRAFT_NAME':
      return { ...state, loadedDraftName: null };
    default:
      break;
  }
  return state;
};

export default editorReducer;
