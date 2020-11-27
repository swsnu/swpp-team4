import editorReducer from './editor';

describe ('algo reducer', () => {
    it ('should reset', () => {
        const action = { type: 'RESET', data: {} };
        editorReducer(undefined, action);
    })
    it ('should load draft', () => {
        const action = { type: 'LOAD_DRAFT_NAME', data: {} };
        editorReducer(undefined, action);
    })
    it ('should delete draft', () => {
        const action = { type: 'DELETE_DRAFT_NAME' };
        editorReducer(undefined, action);
    })
})