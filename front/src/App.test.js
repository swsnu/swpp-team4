import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { mount } from 'enzyme';
import { getMockStore } from './test-utils/mocks';
import { initialState } from './store/reducers/user';
import { history } from './reduxRelated';

const mockStore = getMockStore(initialState);

describe('renders App?', () => {
  let app;

  beforeEach(() => {
    app = (
      <Provider store={mockStore}>
        <App history={history} id='testApp'/>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render App.js', () => {
    const component = mount(app);
    expect(component.find('#testApp').length).toBe(1);
  });
});
