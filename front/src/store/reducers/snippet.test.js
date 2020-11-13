import React from 'react';
import snippetReducer from './snippet';

describe ('snippet reducer', () => {
    it ('should reset', () => {
        const action = { type: 'RESET', data: {} };
        snippetReducer(undefined, action);
    })

    it ('should get owned snippet', () => {
        const action = { type: 'GET_OWNED_SNIPPET', data: {} };
        snippetReducer(undefined, action);
    })

    it ('should add owned snippet', () => {
        const action = { type: 'ADD_OWNED_SNIPPET', data: {} };
        snippetReducer(undefined, action);
    })

    it ('should break', () => {
        const action = { type: '', data: {} };
        snippetReducer(undefined, action);
    })
})