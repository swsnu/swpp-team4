import React from 'react';
import loginModal from './loginModal';
import { mount} from 'enzyme';
import {Route, Switch} from "react-router-dom";
import {history} from "../reduxRelated";
import {Provider} from "react-redux";
import {getMockStore} from "../test-utils/mocks";
import {ConnectedRouter} from "connected-react-router";

const stubInitialState= {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false
}

const mockStore = getMockStore(stubInitialState);

describe ('loginModal', () => {

  let login;
  beforeEach(() => {
    login = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact component={loginModal}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  })

  it ('should render without errors', () => {
    const component = mount(login);
    const wrapper = component.find('.LoginModal');
    expect(wrapper.length).toBe(1);
  })

  it ('should set username correctly', () => {
    const username = '';
    const component = mount(login);
    const wrapper = component.find('input#id_input');
    wrapper.simulate('change', { target: {value: username} });
    const password = '';
    const component2 = mount(login);
    const wrapper2 = component2.find('input#password_input');
    wrapper2.simulate('change', { target: {value: password} });

    const wrapper3 = component.find('#login_button').at(0);
    wrapper3.simulate('click');
  })
}) 
