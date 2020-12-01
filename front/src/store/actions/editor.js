export const loadDraftName = (name) => {
  return (dispatch) => {
    dispatch({ type: 'LOAD_DRAFT_NAME', data: name });
  };
};

export const deleteDraftName = () => {
  return (dispatch) => {
    dispatch({ type: 'DELETE_DRAFT_NAME' });
  };
};
