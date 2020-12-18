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

jest.mock('react-codemirror2');

const stubInitialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const stubInitialState2 = {
  ownedAlgorithmList: [
    {
      name: 'testName',
      id: 1,
      description: 'testDescription',
    },
  ],
};

const mockStore = getMockStore(stubInitialState, stubInitialState2, {});

describe('DashboardPage', () => {
  let dashboard;
  beforeEach(() => {
    dashboard = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" component={DashboardPage}/>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render DashboardPage without errors and call startBacktest()', () => {
    jest
      .spyOn(NewBackTestFormImport, 'NewBackTestForm')
      .mockImplementation(({ onSubmit }) => {
        useEffect(() => {
          onSubmit({
            startDate: '2020-02-03',
            endDate: '2020-04-03',
            startingBudget: '10000000',
          });
        }, []);
        return <>Mock Component :)</>;
      });
    jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve) => {
        const result = {
          status: 200,
        };
        resolve(result);
      });
    });
    const component = createMount()(dashboard);
    const wrapper = component.find('DashboardPage');
    expect(wrapper.length).toBe(1);
  });
  it('should render DashboardPage without errors and fail startBacktest()', () => {
    jest
      .spyOn(NewBackTestFormImport, 'NewBackTestForm')
      .mockImplementation(({ onSubmit }) => {
        useEffect(() => {
          onSubmit({
            startDate: '2020-02-03',
            endDate: '2020-04-03',
            startingBudget: '10000000',
          });
        }, []);
        return <>Mock Component :)</>;
      });
    jest.spyOn(axios, 'post').mockImplementation(() => {
      return new Promise((resolve, reject) => {
        const result = {
          status: 404,
          data: { logged_in: false },
        };
        reject(result);
      });
    });
    const component = createMount()(dashboard);
    const wrapper = component.find('DashboardPage');
    expect(wrapper.length).toBe(1);
  });

  it('should change between tabs', () => {
    const component = createMount()(dashboard);
    component.find('button#tab-simulation').simulate('click');
    component.find('button#tab-backtest').simulate('click');
    component.find('button#tab-optimization').simulate('click');
  });

  it('should display backtest data', () => {
    jest.spyOn(BacktestRowImport, 'BacktestRow')
      .mockImplementation(({ onOpenLog }) => {
        onOpenLog();
        return <>Another Mock Component :)</>;
      });
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url.includes('performance')) {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: { profit_dict: '{"2020-02-03":3}', transaction_log: '[{date:"2020-02-03"}]' },
          };
          resolve(result);
        });
      } else {
        return new Promise((resolve) => {
          const result = {
            status: 200,
            data: [
              {
                id: 1,
                transaction_log: '',
                daily_profit: '',
              },
              {
                id: 2,
                transaction_log: '',
                daily_profit: '',
              },
            ],
          };
          resolve(result);
        });
      }
    });
    const component = createMount()(dashboard);
    component.find('div.myAlgo-1').simulate('click');
    component.find('div.myAlgo-1').simulate('click');
  });


  it('should test start_optimization', () => {
    const component = createMount()(dashboard);
    component.find('button#start_optimization').simulate('click');
  });

  // it('should test 2222', () => {
  //   const component = createMount()(dashboard);
  // });

});
