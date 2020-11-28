import React from 'react';
import { BacktestDetailDialog } from './backtestDetailDialog';
import { createRender } from '@material-ui/core/test-utils';

describe('backtestDetailDialog', () => {
  it('should render backtestDetailDialog', () => {
    let render = createRender();
    render(
      <BacktestDetailDialog
        id={0}
        transaction_log={[
          {
            sell: [],
            buy: [],
            date: '2020-01-03',
          },
        ]}
        daily_profit={[
          {
            date: '2020-01-03',
            profit: 100.0,
          },
          {
            date: '2020-01-04',
            profit: 100.0,
          },
          {
            date: '2020-01-05',
            profit: 100.0,
          },
          {
            date: '2020-01-06',
            profit: 100.0,
          },
        ]}
        open={false}
        handleClose={() => {}}
      />,
    );
  });
});
