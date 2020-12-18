import algoReducer from './algo';

describe('algo reducer', () => {
  it('should reset', () => {
    const action = { type: 'RESET', data: {} };
    algoReducer(undefined, action);
  });
  it('should break', () => {
    const action = { type: '', data: {} };
    algoReducer(undefined, action);
  });
  it('should delete an algorithm', () => {
    const action = { type: 'DELETE_ALGORITHM', data: 0 };
    algoReducer({ ownedAlgorithmList: [{ id: 0 }] }, action);
  });

  it('should GET_ALL_ALGORITHM', () => {
    const action = { type: 'GET_ALL_ALGORITHM', data: [] };
    algoReducer({}, action);
  });
});
