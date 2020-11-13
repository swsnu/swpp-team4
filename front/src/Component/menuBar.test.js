import React, {useEffect, useState} from 'react';
import menuBar from './menuBar';

import {mount, shallow} from 'enzyme';
import {createMount, createShallow} from '@material-ui/core/test-utils';

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
const stubInitialState2 = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: true
}

const mockStore = getMockStore(stubInitialState);
const mockStore2 = getMockStore(stubInitialState2);

describe('menuBar', () => {

  let menu;
  let menu2;
  let mount;

  beforeEach(() => {
    mount = createMount();
    menu = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact component={menuBar}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    menu2 = (
      <Provider store={mockStore2}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact component={menuBar}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  })

  it('should render without errors', () => {
    const component = mount(menu);
    const wrapper = component.find('.MenuBar');
    expect(wrapper.length).toBe(1);
  })

  it('should render button', () => {
    const component = mount(menu);
    const component2 = mount(menu2);
    const wrapper = component.find('button#logo_button');
    const wrapper2 = component.find('button#leaderboard_button');
    const wrapper3 = component2.find('button#dashboard_button');
    const wrapper4 = component2.find('button#algo_manage_button');
    const wrapper5 = component2.find('button#logout_button');
    const wrapper6 = component.find('button#signup_button');
    const wrapper7 = component.find('button#login_button');
    wrapper.simulate('click');
    wrapper2.simulate('click');
    wrapper3.simulate('click');
    wrapper4.simulate('click');
    wrapper5.simulate('click');
    wrapper6.simulate('click', {currentTarget: true});
    wrapper7.simulate('click', {currentTarget: true});
    wrapper6.simulate('click', {currentTarget: true});
    wrapper7.simulate('click', {currentTarget: true});
    wrapper6.simulate('close');
    wrapper7.simulate('close');
  })

})
