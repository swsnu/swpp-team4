import React from 'react';
import { LandingPage } from './landingPage';
import { mount } from 'enzyme';
import { Route, Switch } from 'react-router-dom';
import { history } from '../reduxRelated';
import { Provider } from 'react-redux';
import { getMockStore } from '../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';

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
            <Route path="/" exact component={LandingPage} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render without errors', () => {
    const component = mount(landing);
    const wrapper = component.find('LandingPage');
    expect(wrapper.length).toBe(1);
    const wrapper2 = component.find('MenuBar');
    expect(wrapper2.length).toBe(1);
  });
});
