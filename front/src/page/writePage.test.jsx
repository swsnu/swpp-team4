import React from 'react';
import {WritePage} from './writePage';
import {ConnectedRouter} from 'connected-react-router';
import {Provider} from 'react-redux';
import {Route, Redirect, Switch} from 'react-router-dom';
import {getMockStore} from '../test-utils/mocks';
import {history} from '../reduxRelated';
import Container from '@material-ui/core/Container';
import {createMount} from '@material-ui/core/test-utils';
import * as snippetActions from '../store/actions/snippet';
import * as algoActions from '../store/actions/algo';
import {createMemoryHistory} from 'history';

jest.mock('react-codemirror2');

const mockStore = getMockStore(
    {
        userInfo: {
            email: 'test@test.com',
            name: 'tester',
        },
        loggedIn: true,
        snippetSubmit: {
            1: false,
            2: false,
            3: false,
            4: false,
        },
        algorithmSubmit: false,
    },
    {},
    {
        likedSnippetList: [{id: 1, name: '', type: 'scope', code: '', description: ''},
            {id: 2, name: '', type: 'buy', code: '', description: ''},
            {id: 3, name: '', type: 'sell', code: '', description: ''},
            {id: 4, name: '', type: 'amount', code: '', description: ''},
            {id: 5, name: '', type: '', code: '', description: ''},
        ], ownedSnippetList: [{id: 1, name: '', type: 'scope', code: '', description: ''},
            {id: 2, name: '', type: 'buy', code: '', description: ''},
            {id: 3, name: '', type: 'sell', code: '', description: ''},
            {id: 4, name: '', type: 'amount', code: '', description: ''},
            {id: 5, name: '', type: '', code: '', description: ''}]
    },

    {
        loadedDraftName: '',
    },
);

const mockStore2 = getMockStore(
    {
        userInfo: {
            email: 'test@test.com',
            name: 'tester',
        },
        loggedIn: true,
        snippetSubmit: {
            1: true,
            2: true,
            3: true,
            4: true,
        },
        algorithmSubmit: false,
    },
    {},
    {
        likedSnippetList: [{id: 1, name: '', type: 'scope', code: '', description: ''},
            {id: 2, name: '', type: 'buy', code: '', description: ''},
            {id: 3, name: '', type: 'sell', code: '', description: ''},
            {id: 4, name: '', type: 'amount', code: '', description: ''},
            {id: 5, name: '', type: '', code: '', description: ''},
        ], ownedSnippetList: [{id: 1, name: '', type: 'scope', code: '', description: ''},
            {id: 2, name: '', type: 'buy', code: '', description: ''},
            {id: 3, name: '', type: 'sell', code: '', description: ''},
            {id: 4, name: '', type: 'amount', code: '', description: ''},
            {id: 5, name: '', type: '', code: '', description: ''}]
    },
    {
        loadedDraftName: 'test',
    },
);

describe('test WritePage', () => {
    let writePage, writePage2;
    beforeEach(() => {
        global.localStorage.setItem(
            'test',
            JSON.stringify({code: '', name: ['', '', '', '']}),
        );
        writePage = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Container maxWidth="lg">
                        <WritePage history={createMemoryHistory()}/>
                    </Container>
                </ConnectedRouter>
            </Provider>
        );

        writePage2 = (
            <Provider store={mockStore2}>
                <ConnectedRouter history={history}>
                    <Container maxWidth="lg">
                        <WritePage history={createMemoryHistory()}/>
                    </Container>
                </ConnectedRouter>
            </Provider>
        );
    });

    it('should render WritePage', () => {
        const component = createMount()(writePage);
        expect(component.find('input#snippet_name').length).toBe(1);
        expect(component.find('input#algorithm_name').length).toBe(1);
        component.find('button#go_back').simulate('click');
    });

    it('should validate and Submit snippet', () => {
        const component = createMount()(writePage);
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        jest
            .spyOn(snippetActions, 'submitSnippet')
            .mockImplementation(() => async (dispatch) => {
                dispatch({
                    type: 'NO_ACTION',
                });
            });
        component.find('button#submit_snippet').simulate('click');
        component
            .find('input#snippet_name')
            .simulate('change', {target: {value: 'content'}});
        component
            .find('input#snippet_descr')
            .simulate('change', {target: {value: 'content'}});

        component.find('button#submit_snippet').simulate('click');
        // expect(component.find('span#status_message').text()).toEqual('Status: Submitted');
    });

    it('submit Algorithm', () => {
        jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        jest
            .spyOn(snippetActions, 'submitSnippet')
            .mockImplementation(() => async (dispatch) => {
                dispatch({
                    type: 'NO_ACTION',
                });
            });
        jest
            .spyOn(algoActions, 'submitAlgo')
            .mockImplementation(() => async (dispatch) => {
                dispatch({
                    type: 'CHANGE_LOADING',
                    data: false,
                });
            });
        const component = createMount()(writePage2);
        component
            .find('input#algorithm_name')
            .simulate('change', {target: {value: 'content'}});

        component
            .find('input#snippet_name')
            .simulate('change', {target: {value: 'content'}});
        component
            .find('input#snippet_descr')
            .simulate('change', {target: {value: 'content'}});
        // component.find('button#snippet_validate').simulate('click');
        component.find('button#submit_snippet').simulate('click');

        component.find('button#snippet_2').simulate('click');
        component
            .find('input#snippet_name')
            .simulate('change', {target: {value: 'content'}});
        // component.find('button#snippet_validate').simulate('click');
        component.find('button#submit_snippet').simulate('click');

        component.find('button#snippet_3').simulate('click');
        component
            .find('input#snippet_name')
            .simulate('change', {target: {value: 'content'}});
        // component.find('button#snippet_validate').simulate('click');
        component.find('button#submit_snippet').simulate('click');

        component.find('button#snippet_4').simulate('click');
        component
            .find('input#snippet_name')
            .simulate('change', {target: {value: 'content'}});
        // component.find('button#snippet_validate').simulate('click');
        component.find('button#submit_snippet').simulate('click');

        component.find('button#submit_algorithm').simulate('click');
        component
            .find('input#algorithm_descr')
            .simulate('change', {target: {value: 'content'}});
        component.find('button#submit_algorithm').simulate('click');
    });

    it('save draft', () => {
        const component = createMount()(writePage);
        component.find('button#save_algorithm').simulate('click');
    });

    it('import draft', () => {
        const component = createMount()(writePage);
        component.find('button#import_algorithm').simulate('click');
    });

    it('should render snippetRow', () => {
        const component = createMount()(writePage);
        component.find('button#import_algorithm').simulate('click');
        component.find('button#import_button').at(0).simulate('click');
        component.find('button#import_button').at(1).simulate('click');
        component.find('button#import_button').at(2).simulate('click');
        component.find('button#import_button').at(3).simulate('click');
        component.find('button#import_button').at(4).simulate('click');
    })
});
