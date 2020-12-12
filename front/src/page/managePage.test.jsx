import React from 'react';
import {
  Algo,
  LikedSnippet,
  ManagePage,
  SavedAlgo,
} from './managePage';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { getMockStore } from '../test-utils/mocks';
import { history } from '../reduxRelated';
import Container from '@material-ui/core/Container';
import { createMount } from '@material-ui/core/test-utils';
import { createMemoryHistory } from 'history';

const mockStore = getMockStore(
  {
    userInfo: {
      email: 'test@test.com',
      name: 'tester',
    },
    loggedIn: true,
  },
  {
    ownedAlgorithmList: [{ id: 1, name: '', description: '' }],
  },
  {
    ownedSnippetList: [{ id: 1, name: '', description: '' }],
    likedSnippetList: [{ id: 1, name: '', description: '' }],
    sharedSnippetList: [{ id: 1, name: '', description: '' }],
  },
  { loadedDraftName: '' },
);

describe('test managePage', () => {
  let mount, managePage;

  beforeEach(() => {
    mount = createMount();

    managePage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Container maxWidth="lg">
            <ManagePage history={createMemoryHistory()} />
          </Container>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should render ManagePage', () => {
    const component = mount(managePage);
    const wrapper = component.find('ManagePage');
    expect(wrapper.length).toBe(1);
    component.find('button#tab-one').simulate('click');
    component.find('button#tab-two').simulate('click');
    component.find('button#tab-three').simulate('click');
    component.find('button#tab-four').simulate('click');
  });

  it('should handle new-algorithm', () => {
    const component = mount(managePage);
    component.find('button#new-algorithm').simulate('click');
  });

  it('should render Algo', () => {
    const component = mount(managePage);
    const wrapper = component.find('Algo');
    expect(wrapper.length).toBe(1);
  });

  it('should handle Click', () => {
    const component = mount(managePage);
    component.find('#panel1d-header').at(1).simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    const button1 = component.find('button#algo_share');
    window.confirm = jest.fn(() => {
      return true;
    });
    button1.at(0).simulate('click');
    button1.at(0).simulate('click');
    window.confirm = jest.fn(() => {
      return false;
    });
    const button2 = component.find('button#algo_delete');
    button2.at(0).simulate('click');
    button1.at(0).simulate('click');
    window.confirm = jest.fn(() => {
      return true;
    });
    button1.at(0).simulate('click');
    button2.at(0).simulate('click');
  });

  it('should handle Click, false response', () => {
    const component = mount(managePage);
    window.confirm = jest.fn(() => {
      return false;
    });
    const button1 = component.find('button#algo_share');
    button1.at(0).simulate('click');
    const button2 = component.find('button#algo_delete');
    button2.at(0).simulate('click');
  });

  it('should render SavedAlgo', () => {
    const component = mount(managePage);
    global.localStorage.setItem(
      '',
      JSON.stringify({ code: '', name: ['', '', '', ''] }),
    );
    component.find('button#tab-four').simulate('click');
    const wrapper = component.find('SavedAlgo');
    expect(wrapper.length).toBe(0);
    const snippet = component.find('#snippet_name');
  });

  it('should handle Click', () => {
    const component = mount(managePage);
    component.find('button#tab-four').simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    const button2 = component.find('button#saved_algo_delete');
    window.confirm = jest.fn(() => {
      return false;
    });
    button2.at(0).simulate('click');
    window.confirm = jest.fn(() => {
      return true;
    });
    const button1 = component.find('button#saved_algo_resume');
    button1.at(0).simulate('click');

    button2.at(0).simulate('click');
  });

  it('should render Snippet', () => {
    const component = mount(managePage);
    component.find('button#tab-two').simulate('click');
    const wrapper = component.find('.Snippet');
    expect(wrapper.length).toBe(1);
  });

  it('should handle Click', () => {
    const component = mount(managePage);
    component.find('button#tab-two').simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    console.log(component.find('#snippet_accordion'));
    window.confirm = jest.fn(() => {
      return true;
    });
    const button1 = component.find('button#snippet_share');
    button1.at(0).simulate('click');
    window.confirm = jest.fn(() => {
      return false;
    });
    button1.at(0).simulate('click');
    component.find('button#tab-three').simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    component.find('#panel1d-header').at(1).simulate('click');
    const button2 = component.find('button#snippet_like');
    window.confirm = jest.fn(() => {
      return true;
    });
    button2.at(0).simulate('click');
    window.confirm = jest.fn(() => {
      return false;
    });
    button2.at(0).simulate('click');
  });

  it('should render LikedSnippet', () => {
    const component = mount(managePage);
    component.find('button#tab-three').simulate('click');
    const wrapper = component.find('LikedSnippet');
    expect(wrapper.length).toBe(1);
  });
});
