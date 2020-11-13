import React, { useEffect, useState } from 'react';
import { LandingPage } from './landingPage';

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

describe('landingPage', () => {

  let landing;
  beforeEach(() => {
    landing = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact component={LandingPage}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(landing);
    console.log(component.debug())
    const wrapper = component.find('LandingPage');
    expect(wrapper.length).toBe(1);
    const wrapper2 = component.find('MenuBar');
    expect(wrapper2.length).toBe(1);
  });

});
