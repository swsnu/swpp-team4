import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { mount } from 'enzyme';
import { getMockStore } from './test-utils/mocks';
import { initialState } from './store/reducers/user';
import { history } from './reduxRelated';

describe('renders App?', () => {

  it('should render App.js', () => {
    const mockStore = getMockStore(initialState);
    const app = (
      <Provider store={mockStore}>
        <App history={history} id='testApp'/>
      </Provider>
    );
    const component = mount(app);
    expect(component.find('#testApp').length).toBe(1);
  });

  it('should render logged in App.js', () => {
    const mockStore2 = getMockStore({
      userInfo: {
        email: '',
        name: '',
      },
      loggedIn: true,
    })
    const app = (
      <Provider store={mockStore2}>
        <App history={history} id='testApp'/>
      </Provider>
    );
    const component = mount(app);
    expect(component.find('#testApp').length).toBe(1);
  });
});
