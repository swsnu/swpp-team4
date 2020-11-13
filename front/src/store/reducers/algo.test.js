import React from 'react';
import algoReducer from './algo';

describe ('algo reducer', () => {
    it ('should reset', () => {
        const action = { type: 'RESET', data: {} };
        algoReducer(undefined, action);
    })
    it ('should break', () => {
        const action = { type: '', data: {} };
        algoReducer(undefined, action);
    })
})