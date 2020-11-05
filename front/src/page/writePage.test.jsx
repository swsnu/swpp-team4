import React from 'react';
import { WritePage } from './writePage';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { getMockStore } from '../test-utils/mocks';
import { history } from '../reduxRelated';
import { shallow, mount } from 'enzyme';
import Container from '@material-ui/core/Container';

jest.mock('react-codemirror2');

const mockStore = getMockStore({
  userInfo: {
    email: 'test@test.com',
    name: 'tester',
  },
  loggedIn: true,
});

describe('test WritePage', () => {
  let writePage;
  beforeEach(() => {
    writePage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Container maxWidth="lg">
            <Switch>
              <Route
                path='/'
                exact
                render={() => <WritePage/>}
              />
            </Switch>
          </Container>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render WritePage', () => {
    const component = mount(writePage);
    expect(component.find('input#snippet_name').length).toBe(1);
    expect(component.find('input#algorithm_name').length).toBe(1);
  });

  it('should validate and Submit snippet', () => {
    const component = mount(writePage);
    const alertMock = jest.spyOn(window, 'alert')
      .mockImplementation(() => {
      });
    jest.spyOn(Math, 'random')
      .mockImplementation(() => 0);
    component.find('input#snippet_name').simulate('change', { target: { value: 'content' } });
    component.find('button#snippet_validate').simulate('click');
    expect(alertMock).toHaveBeenCalledTimes(1);
    jest.spyOn(Math, 'random').mockImplementation(() => 1);
    component.find('button#snippet_validate').simulate('click');
    jest.spyOn(Math, 'random').mockImplementation(() => 0);
    component.find('button#submit_snippet').simulate('click');
    jest.spyOn(Math, 'random').mockImplementation(() => 1);
    component.find('button#submit_snippet').simulate('click');
    jest.spyOn(Math, 'random').mockImplementation(() => 0);
    component.find('button#submit_snippet').simulate('click');
    console.log(component.find('span#status_message').props().value);
    expect(component.find('span#status_message').text()).toEqual('Status: Submitted');
  });

  it('submit Algorithm', () => {
    jest.spyOn(Math, 'random').mockImplementation(() => 1);
    const component = mount(writePage);
    component.find('input#algorithm_name').simulate('change', { target: { value: 'content' } });
    component.find('button#submit_algorithm').simulate('click');

    component.find('input#snippet_name').simulate('change', { target: { value: 'content' } });
    component.find('button#snippet_validate').simulate('click');
    component.find('button#submit_snippet').simulate('click');

    component.find('button#snippet_2').simulate('click');
    component.find('input#snippet_name').simulate('change', { target: { value: 'content' } });
    component.find('button#snippet_validate').simulate('click');
    component.find('button#submit_snippet').simulate('click');

    component.find('button#snippet_3').simulate('click');
    component.find('input#snippet_name').simulate('change', { target: { value: 'content' } });
    component.find('button#snippet_validate').simulate('click');
    component.find('button#submit_snippet').simulate('click');

    component.find('button#snippet_4').simulate('click');
    component.find('input#snippet_name').simulate('change', { target: { value: 'content' } });
    component.find('button#snippet_validate').simulate('click');
    component.find('button#submit_snippet').simulate('click');

    // TODO
    jest.spyOn(Math, 'random').mockImplementation(() => 0);
    component.find('button#submit_algorithm').simulate('click');
    jest.spyOn(Math, 'random').mockImplementation(() => 1);
    component.find('button#submit_algorithm').simulate('click');
  });

  it('save draft', () => {
    const component = mount(writePage);
    component.find('button#save_algorithm').simulate('click');
  });

  it('import draft', () => {
  });


});
