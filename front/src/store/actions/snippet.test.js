import React from 'react';
import * as actionCreators from './snippet';
import axios from 'axios';
import {store} from '../../reduxRelated';

describe('snippet actions', () => {
    it ('should submit snippet', async () => {
        axios.post = jest.fn(url => {
            return Promise.resolve({status: 201, data: {}});
        });

        await store.dispatch(actionCreators.submitSnippet());
    })

    it ('should catch submit snippet error', async () => {
        axios.post = jest.fn(url => {
            return Promise.resolve({status: 400, data: {}});
        });

        await store.dispatch(actionCreators.submitSnippet());
    })
})