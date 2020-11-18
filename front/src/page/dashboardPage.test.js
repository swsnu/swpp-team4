import React, { useEffect } from 'react';
import { DashboardPage } from './dashboardPage';
import { Route, Switch } from 'react-router-dom';
import { history } from '../reduxRelated';
import { Provider } from 'react-redux';
import { getMockStore } from '../test-utils/mocks';
import { ConnectedRouter } from 'connected-react-router';
import { createMount } from '@material-ui/core/test-utils';
import * as NewBackTestFormImport from '../Component/dashboard/backtest/newBackTestForm';
import * as BacktestRowImport from '../Component/dashboard/backtest/backtestRow';
import axios from 'axios';

const stubInitialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const stubInitialState2 = {
  ownedAlgorithmList: [{
    name: 'testName',
    id: 1,
    description: 'testDescription',
  }],
};

const mockStore = getMockStore(stubInitialState, stubInitialState2, {});

describe('DashboardPage', () => {

  let dashboard;
  beforeEach(() => {
    dashboard = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' component={DashboardPage}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render DashboardPage without errors', () => {
    jest.spyOn(NewBackTestFormImport, 'NewBackTestForm')
      .mockImplementation(({ onSubmit }) => {
        useEffect(() => {
          onSubmit();
        }, []);
        return <>Mock Component :)</>;
      });
    const component = createMount()(dashboard);
    const wrapper = component.find('DashboardPage');
    expect(wrapper.length).toBe(1);
  });

  it('should change between tabs', () => {
    const component = createMount()(dashboard);
    component.find('button#tab-simulation').simulate('click');
    component.find('button#tab-backtest').simulate('click');
  });

  it('should display backtest data', () => {
    jest.spyOn(BacktestRowImport, 'BacktestRow')
      .mockImplementation(({ onOpenLog }) => {
        onOpenLog();
        return <>Another Mock Component :)</>;
      });
    jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return {
          data: [{
            id: 1,
            transaction_log: '',
            daily_profit: '',
          }, {
            id: 2,
            transaction_log: '',
            daily_profit: '',
          }],
        };
      });
    const component = createMount()(dashboard);
    component.find('div.myAlgo-1').simulate('click');
    jest.spyOn(axios, 'get')
      .mockImplementation(() => {
        return false;
      });
    component.find('div.myAlgo-1').simulate('click');
  });

  // it('should fetch and display BacktestRow table', () => {
  // });
});
