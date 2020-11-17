import React from 'react';
import { BacktestDetailDialog } from './backtestDetailDialog';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';
import { createMount, createRender } from '@material-ui/core/test-utils';
import { getMockStore } from '../../../test-utils/mocks';

const stubInitialState = {
  userInfo: {
    email: '',
    name: '',
  },
  loggedIn: false,
};

const mockStore = getMockStore(stubInitialState);

describe('backtestDetailDialog', () => {

  let backtestDetailDialog;
  beforeEach(() => {
    backtestDetailDialog = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path='/' exact component={
              <BacktestDetailDialog
                id={0}
                transaction_log={[{
                  'sell': [],
                  'buy': [],
                  'date': '2020-01-03',
                }]}
                daily_profit={[{
                  'date': '2020-01-03',
                  'profit': 100.0,
                }]}
                open={false}
                handleClose={() => {
                }}
              />
            }
            />
          </Switch>
        </ConnectedRouter>
        }
      </Provider>
    );
  });

  it('should render backtestDetailDialog', () => {
    let render = createRender();
    const component = render(<BacktestDetailDialog
      id={0}
      transaction_log={[{
        'sell': [],
        'buy': [],
        'date': '2020-01-03',
      }]}
      daily_profit={[{
        'date': '2020-01-03',
        'profit': 100.0,
      },{
        'date': '2020-01-04',
        'profit': 100.0,
      },{
        'date': '2020-01-05',
        'profit': 100.0,
      },{
        'date': '2020-01-06',
        'profit': 100.0,
      },]}
      open={false}
      handleClose={() => {
      }}
    />);
  });

});
