import React from 'react';
import { ManagePage} from './managePage';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { getMockStore } from '../test-utils/mocks';
import { history } from '../reduxRelated';
import Container from '@material-ui/core/Container';
import { createMount } from '@material-ui/core/test-utils';


const mockStore = getMockStore({
  userInfo: {
    email: 'test@test.com',
    name: 'tester',
  },
  loggedIn: true,
});

describe('test managePage', () => {
  let mount
  let managePage;

  beforeEach(() => {
    mount = createMount();

    managePage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Container maxWidth="lg">
            <Switch>
              <Route
                path='/'
                exact
                render={() => <ManagePage/>}
              />
            </Switch>
          </Container>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render ManagePage', () => {
    const component = mount(managePage);
    // expect(component.find('input#snippet_name').length).toBe(1);
    // expect(component.find('input#algorithm_name').length).toBe(1);
  });

});
