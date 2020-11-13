import React from 'react';
import { Algo, LikedSnippet, ManagePage, SavedAlgo, Snippet } from './managePage';
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
  let mount, managePage;

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
    const wrapper = component.find('ManagePage');
    expect(wrapper.length).toBe(1);
  });

  it('should handle Click', () => {
    const component = mount(managePage);
    console.log(component.debug())
    const newButton = component.find('button#new-algorithm');
    newButton.simulate('click');
  });
});


describe('test Algo', () => {
  let mount, algo;

  beforeEach(() => {
    mount = createMount();
    algo = <Algo/>;
  });

  it('should render Algo', () => {
    const component = mount(algo);
    const wrapper = component.find('Algo');
    expect(wrapper.length).toBe(1);
  });

  it('should handle Click', () => {
    const component = mount(algo);
    const buttons = component.find('button');
    expect(buttons.length).toBe(2);
    buttons.at(0).simulate('click');
  });
});


describe('test SavedAlgo', () => {
  let mount, savedAlgo;

  beforeEach(() => {
    mount = createMount();
    savedAlgo = <SavedAlgo/>;
  });

  it('should render SavedAlgo', () => {
    const component = mount(savedAlgo);
    const wrapper = component.find('SavedAlgo');
    expect(wrapper.length).toBe(1);
  });

  it('should handle Click', () => {
    const component = mount(savedAlgo);
    const buttons = component.find('button');
    expect(buttons.length).toBe(2);
    buttons.at(0).simulate('click');
  });
});


describe('test Snippet', () => {
  let mount, snippet;

  beforeEach(() => {
    mount = createMount();
    snippet = <Snippet/>;
  });

  it('should render Snippet', () => {
    const component = mount(snippet);
    const wrapper = component.find('Snippet');
    expect(wrapper.length).toBe(1);
  });

  it('should handle Click', () => {
    const component = mount(snippet);
    const buttons = component.find('button');
    expect(buttons.length).toBe(1);
    buttons.at(0).simulate('click');
  });
});


describe('test LikedSnippet ', () => {
  let mount, likedSnippet;

  beforeEach(() => {
    mount = createMount();
    likedSnippet = <LikedSnippet/>;
  });

  it('should render LikedSnippet', () => {
    const component = mount(likedSnippet);
    const wrapper = component.find('LikedSnippet');
    expect(wrapper.length).toBe(1);
  });
});

