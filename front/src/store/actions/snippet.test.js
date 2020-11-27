import * as actionCreators from './snippet';
import axios from 'axios';
import {store} from '../../reduxRelated';

describe('snippet actions', () => {
    it ('should submit snippet', async () => {
        axios.post = jest.fn(() => {
            return Promise.resolve({status: 201, data: {}});
        });

        await store.dispatch(actionCreators.submitSnippet());
    })

    it ('should catch submit snippet error', async () => {
        axios.post = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}});
        });

        await store.dispatch(actionCreators.submitSnippet());
    })

    it ('should catch submit snippet error', async () => {
        axios.post = jest.fn(() => {
            return Promise.reject(new Error(''));
        });

        await store.dispatch(actionCreators.submitSnippet());
    })

    it ('should share a snippet', async () => {
        axios.put = jest.fn(() => {
            return Promise.resolve({status:200, data: {}});
        });

        await store.dispatch(actionCreators.shareSnippet(0, true));
    })

    it ('should not share a snippet', async () => {
        axios.put = jest.fn((url, data) => {
            return Promise.resolve({status: 200, data: {}})
        })
        await store.dispatch(actionCreators.shareSnippet(0, false));
    })

    it ('should share a snippet but get an error', async () => {
        axios.put = jest.fn(() => {
            return Promise.reject(new Error(''));
        });

        await store.dispatch(actionCreators.shareSnippet(0, true));
    })

    it ('should share a snippet but get bad response', async () => {
        axios.put = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}});
        })
        await store.dispatch(actionCreators.shareSnippet(0, true))
    })

    it ('should like a snippet', async () => {
        axios.put = jest.fn(() => {
            return Promise.resolve({status:200, data: {}});
        });

        await store.dispatch(actionCreators.likeSnippet(0, true));
    })

    it ('should not like a snippet', async () => {
        axios.put = jest.fn((url, data) => {
            return Promise.resolve({status: 200, data: {}})
        })
        await store.dispatch(actionCreators.likeSnippet(0, false));
    })

    it ('should like a snippet but get an error', async () => {
        axios.put = jest.fn(() => {
            return Promise.reject(new Error(''));
        });

        await store.dispatch(actionCreators.likeSnippet(0, true));
    })

    it ('should like a snippet but get bad response', async () => {
        axios.put = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}});
        })
        await store.dispatch(actionCreators.likeSnippet(0, true));
    })

    it ('should get all my snippets', async () => {
        axios.get = jest.fn(() => {
            return Promise.resolve({status: 200, data: {}});
        })
        await store.dispatch(actionCreators.getAllMySnippets());
    })

    it ('should get all my snippets but get an error', async () => {
        axios.get = jest.fn(() => {
            return Promise.reject(new Error(''));
        })
        await store.dispatch(actionCreators.getAllMySnippets());
    })

    it ('should get all my snippets but get a bad response', async () => {
        axios.get = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}});
        })
        await store.dispatch(actionCreators.getAllMySnippets());
    })

    it ('should get liked snippets', async () => {
        axios.get = jest.fn(() => {
            return Promise.resolve({status: 200, data: {}});
        })
        await store.dispatch(actionCreators.getLikedSnippets());
    })

    it ('should get liked snippets but get an error', async () => {
        axios.get = jest.fn(() => {
            return Promise.reject(new Error(''));
        })
        await store.dispatch(actionCreators.getLikedSnippets());
    })

    it ('should get liked snippets but get a bad response', async () => {
        axios.get = jest.fn(() => {
            return Promise.resolve({status: 400, data: {}});
        })
        await store.dispatch(actionCreators.getLikedSnippets());
    })


})
