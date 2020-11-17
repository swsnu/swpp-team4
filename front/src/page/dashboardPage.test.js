import React from 'react';
import { DashboardPage } from './dashboardPage';
import { Route, Switch } from 'react-router-dom';
import { history } from '../reduxRelated';
import { Provider } from 'react-redux';
import { getMockStore } from '../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';
import { createMount } from '@material-ui/core/test-utils';

const stubInitialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const mockStore = getMockStore(stubInitialState);

describe('DashboardPage', () => {

  let dashboard, mount;
  beforeEach(() => {
    mount = createMount();
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
