import React, {useEffect, useState} from 'react';
import signupModal from './signupModal';

import {mount, shallow} from 'enzyme';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Route, Switch} from "react-router-dom";
import {history} from "../reduxRelated";

import {Provider} from "react-redux";
import {getMockStore} from "../test-utils/mocks";

import * as actionCreators from '../store/actions/user';
import {ConnectedRouter} from "connected-react-router";
import store from "../reduxRelated";

import axios from 'axios';

const stubInitialState = {
    userInfo: {
        email: '',
        name: '',
    },
    loggedIn: false
}

const mockStore = getMockStore(stubInitialState);

describe('signupModal', () => {

    let signup;
    beforeEach(() => {
        signup = (
            <Provider store={mockStore}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route path='/' exact component={signupModal}/>
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    })

    it('should render without errors', () => {
        const component = mount(signup);
        const wrapper = component.find('.SignupModal');
        expect(wrapper.length).toBe(1);
    })

    it('should set username correctly', () => {
        const username = '';
        const component = mount(signup);
        const wrapper = component.find('input#id_input');
        wrapper.simulate('change', {target: {value: username}});
        const password = '';
        const wrapper2 = component.find('input#password_input');
        wrapper2.simulate('change', {target: {value: password}});
        const wrapper4 = component.find('input#email_input');
        wrapper4.simulate('change', {target: {value: password}});
        const wrapper3 = component.find('button#sign_up_button');
        wrapper3.simulate('click');
    })
})