import userReducer from './user';
import * as actionTypes from '../actions/actionTypes';

describe('LoginReducer', () => {
    it ('should login', () => {
        const action = { type: actionTypes.SIGN_IN, loggedIn: false };
        userReducer(undefined, action);
    })
    it ('should reset', () => {
        const action = { type: 'RESET'};
        userReducer(undefined, action);
    })
})
