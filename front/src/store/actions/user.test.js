import React from 'react';
import * as actionCreators from './user';
import axios from 'axios';
import {store} from '../../reduxRelated';

describe('user action', () => {
    it('should sign in', async () => {
        axios.post = jest.fn(url => {
            return Promise.resolve({status: 204, data: {}});
        });

        await store.dispatch(actionCreators.sign_in());


    })

    it('should catch error', async () => {
        axios.post = jest.fn(url => {
            return Promise.resolve({status: 400, data: {}});
        });

        await store.dispatch(actionCreators.sign_in());

    })

    it('should sign out', async () => {
        axios.get = jest.fn(url => {
            return Promise.resolve({status: 204, data: {}});
        })

        await store.dispatch(actionCreators.sign_out());
    })
})