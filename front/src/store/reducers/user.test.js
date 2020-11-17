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

    it ('should reset submit snippet', () => {
        const action = { type: 'RESET_SUBMIT_SNIPPET'};
        userReducer(undefined, action);
    })

    it ('should change loading', () => {
        const action = { type: 'CHANGE_SUBMIT_ALGORITHM'};
        userReducer(undefined, action);
    })

    it ('should CHANGE LOADING', () => {
        const action = { type: 'CHANGE_LOADING'};
        userReducer(undefined, action);
    })
})
