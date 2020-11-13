import React, { useEffect, useState } from 'react';
import { DashboardPage } from './dashboardPage';

import { mount, shallow } from 'enzyme';

import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { history } from '../reduxRelated';
import { Provider } from 'react-redux';
import { getMockStore } from '../test-utils/mocks';

import * as actionCreators from '../store/actions/user';
import { ConnectedRouter } from 'connected-react-router';
import store from '../reduxRelated';

import axios from 'axios';

const stubInitialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const mockStore = getMockStore(stubInitialState);

describe('DashboardPage', () => {

  let dashboard;
  beforeEach(() => {
    dashboard = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact component={DashboardPage}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render DashboardPage without errors', () => {
    const component = mount(dashboard);
    const wrapper = component.find('DashboardPage');
    expect(wrapper.length).toBe(1);
  });

});
