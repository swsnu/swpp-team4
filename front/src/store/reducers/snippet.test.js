import snippetReducer from './snippet';

describe('snippet reducer', () => {
  it('should reset', () => {
    const action = { type: 'RESET', data: {} };
    snippetReducer(undefined, action);
  });

  it('should get owned snippet', () => {
    const action = { type: 'GET_OWNED_SNIPPET', data: {} };
    snippetReducer(undefined, action);
  });

  it('should add owned snippet', () => {
    const action = { type: 'ADD_OWNED_SNIPPET', data: {} };
    snippetReducer(undefined, action);
  });

  it('should break', () => {
    const action = { type: '', data: {} };
    snippetReducer(undefined, action);
  });

  it('should like snippet', () => {
    const action = { type: 'LIKE_SNIPPET', data: {} };
    snippetReducer(undefined, action);
  });

  it('should unlike snippet', () => {
    const action = { type: 'UNLIKE_SNIPPET', data: { id: 0 } };
    snippetReducer({ likedSnippetList: [{ id: 0 }] }, action);
  });

  it('should get liked snippet', () => {
    const action = { type: 'GET_LIKED_SNIPPET', data: {} };
    snippetReducer(undefined, action);
  });

  it('should add shared snippet', () => {
    const action = { type: 'ADD_SHARED_SNIPPET', data: {} };
    snippetReducer(undefined, action);
  });

  it('should delete shared snippet', () => {
    const action = { type: 'DELETE_SHARED_SNIPPET', data: { id: 0 } };
    snippetReducer({ sharedSnippetList: [{ id: 0 }] }, action);
  });
});
