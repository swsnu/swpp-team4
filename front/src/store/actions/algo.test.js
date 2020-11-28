import * as actionCreators from './algo';
import axios from 'axios';
import {store} from '../../reduxRelated';

describe('algo actions', () => {
    it('should get all my algorithms', async () => {
        axios.get = jest.fn(() => {
            return Promise.resolve({status: 200, data: {}})
        });
        await store.dispatch(actionCreators.getAllMyAlgorithm());
    })

    it('should fail to submit an algorithm', async () => {
        const name = '';
        const descr = '';
        const snippets = ['','','',''];
        axios.post = jest.fn(() => {
            return Promise.reject(new Error(''))
        });
        await store.dispatch(actionCreators.submitAlgo(name, descr, snippets));
    })

    it('should fail to submit an algorithm', async () => {
        const name = '';
        const descr = '';
        const snippets = ['','','',''];
        axios.post = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}})
        });
        await store.dispatch(actionCreators.submitAlgo(name, descr, snippets));
    })

    it('submit an algorithm', async () => {
        const name = '';
        const descr = '';
        const snippets = ['','','',''];


        window.confirm = jest.fn(() => {
            return true;
        })

        axios.post = jest.fn((url) => {
            if (url === '/api/algo')
                return Promise.resolve({status: 201, data: {id: 0}});
            else if (url === "/api/algo/backtest")
                return Promise.resolve({status: 200, data: {}});
        })

        await store.dispatch(actionCreators.submitAlgo(name, descr, snippets));

    })

    it('submit an algorithm but fail confirm', async () => {
        const name = '';
        const descr = '';
        const snippets = ['','','',''];
        axios.post = jest.fn(() => {
            return Promise.resolve({status: 201})
        })

        window.confirm = jest.fn(() => {
            return false;
        })

        await store.dispatch(actionCreators.submitAlgo(name, descr, snippets));
    })

    it ('should delete an algorithm', async () => {
        axios.delete = jest.fn(() => {
            return Promise.resolve({status: 204})
        })
        await store.dispatch(actionCreators.deleteAlgo(0));
        axios.delete = jest.fn(() => {
            return Promise.reject(new Error(''));
        })
        await store.dispatch(actionCreators.deleteAlgo(0));
    })

    it ('should share an algorithm', async () => {
        axios.put = jest.fn((url, data) => {
            return Promise.resolve({status: 200, data: {}})
        })
        await store.dispatch(actionCreators.shareAlgo(0, true))
    })

    it ('should not share an algorithm', async () => {
        axios.put = jest.fn((url, data) => {
            return Promise.resolve({status: 200, data: {}})
        })
        await store.dispatch(actionCreators.shareAlgo(0, false));
    })

    it ('should fail to share an algorithm', async () => {
        axios.put = jest.fn(() => {
            return Promise.reject(new Error(''));
        })
        await store.dispatch(actionCreators.shareAlgo(0, true))
    })

    it ('should share algorithm but get bad response', async () => {
        axios.put = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}});
        })
        await store.dispatch(actionCreators.shareAlgo(0, true))
    })
})