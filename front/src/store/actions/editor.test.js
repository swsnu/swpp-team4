import * as actionCreators from './editor';
import { store } from '../../reduxRelated';

describe('editor actions', () => {
  it('should load draft name', () => {
    store.dispatch(actionCreators.loadDraftName());
  });

  it('should delete draft name', () => {
    store.dispatch(actionCreators.deleteDraftName());
  });
});
