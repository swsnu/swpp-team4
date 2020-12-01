import React from 'react';
import signupModal from './signupModal';
import { mount } from 'enzyme';
import { Route, Switch } from 'react-router-dom';
import { history } from '../reduxRelated';
import { Provider } from 'react-redux';
import { getMockStore } from '../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';

import axios from 'axios';

const stubInitialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const mockStore = getMockStore(stubInitialState);

describe('signupModal', () => {
  let signup;
  beforeEach(() => {
    signup = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={signupModal} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(signup);
    const wrapper = component.find('.SignupModal');
    expect(wrapper.length).toBe(1);
  });

  it('should set username correctly', () => {
    const username = '';
    const component = mount(signup);
    const wrapper = component.find('input#id_input');
    wrapper.simulate('change', { target: { value: username } });
    const password = '';
    const wrapper2 = component.find('input#password_input');
    wrapper2.simulate('change', { target: { value: password } });
    const wrapper4 = component.find('input#email_input');
    wrapper4.simulate('change', { target: { value: password } });
    const wrapper3 = component.find('button#sign_up_button');

    /*eslint-disable no-unused-vars*/
    jest.spyOn(axios, 'post').mockImplementation((url, data) => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 200,
          data: { logged_in: false },
        };
        resolve(result);
      });
    });
    wrapper3.simulate('click');
    jest.clearAllMocks();

    /*eslint-disable no-unused-vars*/
    jest.spyOn(axios, 'post').mockImplementation((url, data) => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 404,
          data: { logged_in: false },
        };
        reject(result);
      });
    });
    wrapper3.simulate('click');
  });
});
