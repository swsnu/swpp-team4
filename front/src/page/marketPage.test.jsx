import { MarketPage } from './marketPage';
import axios from 'axios';
import { createMount } from '@material-ui/core/test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../reduxRelated';
import { getMockStore } from '../test-utils/mocks';
import * as MarketTableRowImport from '../Component/market/marketTableRow';

const mockStore = getMockStore({
  userInfo: {
    email: 'test@test.com',
    username: 'test',
  },
  loggedIn: true,
});

describe('test marketPage', () => {

  let marketPage;
  beforeEach(() => {
    marketPage = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' component={MarketPage}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders marketPage and search', () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return {
          data: [{
            author: 1,
            id: 11,
            code: 'k',
            description: 'erf',
            is_shared: false,
            name: 'qwe',
            type: 'buy',
            liker_list: [{ id: 1, username: 'test' }],
          }],
        };
      });
    const component = createMount()(marketPage);
    component.find('input#search-input').simulate('change', { target: { value: 'test' } });
    component.find('label#search-by-name input').simulate('change', { target: { value: 'name' } });
    component.find('button#search-snippet').simulate('click');
    component.find('label#search-by-author input').simulate('change', { target: { value: 'author' } });
    component.find('button#search-snippet').simulate('click');
    component.find('label#search-by-description input').simulate('change', { target: { value: 'description' } });
    component.find('button#search-snippet').simulate('click');
    component.find('label#search-type-all input').simulate('change', { target: { value: 'description' } });
    component.find('button#search-snippet').simulate('click');
    component.find('label#search-type-buy input').simulate('change', { target: { value: 'description' } });
    component.find('button#search-snippet').simulate('click');

  });

  it('handles failed axios request', () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 404,
          data: { logged_in: false },
        };
        reject(result);
      });
    });
    const component = createMount()(marketPage);
    component.find('label#search-by-name input').simulate('change', { target: { value: 'name' } });
    component.find('label#search-type-buy input').simulate('change', { target: { value: 'buy' } });
    component.find('input#search-input').simulate('change', { target: { value: 'test' } });
    component.find('button#search-snippet').simulate('click');
  });


  it('handles liking snippets', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return {
          data: [{
            author: 1,
            id: 11,
            code: 'k',
            description: 'erf',
            is_shared: false,
            name: 'qwe',
            type: 'buy',
            liker_list: [{ id: 1, username: 'test' }],
          }, {
            author: 1,
            id: 12,
            code: 'k',
            description: 'erf',
            is_shared: false,
            name: 'qwe',
            type: 'buy',
            liker_list: [{ id: 1, username: 'test' }],
          }],
        };
      });
    jest.spyOn(axios, 'post')
      .mockImplementation(() => {
        return {
          data: {
            author: 1,
            id: 11,
            code: 'k',
            description: 'erf',
            is_shared: false,
            name: 'qwe',
            type: 'buy',
            liker_list: [{ id: 1, username: 'test' }],
          },
        };
      });
    jest.spyOn(MarketTableRowImport, 'MarketTableRow')
      .mockImplementation(({ onLikedChange }) => {
        console.log('test this');
        onLikedChange();
        return <tr>Mock Component :)</tr>;
      });
    let component;
    component = createMount()(marketPage);
    component.update();
    component.find('label#search-by-name input').simulate('change', { target: { value: 'name' } });
    component.find('label#search-type-buy input').simulate('change', { target: { value: 'buy' } });
    component.find('input#search-input').simulate('change', { target: { value: 'test' } });
    await component.find('button#search-snippet').simulate('click');
    await component.update();
    // console.log(component.debug());

    jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 404,
          data: { logged_in: false },
        };
        reject(result);
      });
    });
    await component.find('button#search-snippet').simulate('click');
    await component.update();
  });


});
