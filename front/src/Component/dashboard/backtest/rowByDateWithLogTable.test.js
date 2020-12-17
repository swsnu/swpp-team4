import React from 'react';
import { RowByDateWithLogTable } from './rowByDateWithLogTable';
import { createMount } from '@material-ui/core/test-utils';

describe('backtestDetailDialog', () => {
  it('should render rowByDateWithLogTable', () => {
    const component = createMount()(<RowByDateWithLogTable
      transaction_log={{
        sell: [
          {
            name: '대신정보통신',
            price: 1400,
            amount: 714,
          },
        ],
        buy: [
          {
            name: '대신정보통신',
            price: 1400,
            amount: 714,
          },
        ],
        date: '2020-01-03',
      }}
      daily_profit={{
        date: '2020-01-03',
        profit: 100.0,
      }}
    />);
    component.find('button.toggle-expand').simulate('click');
  });

  it('should render rowByDateWithLogTable with mode "f"', () => {
    const component = createMount()(<RowByDateWithLogTable
      transaction_log={{
        sell: [
          {
            name: '대신정보통신',
            price: 1400,
            amount: 714,
          },
        ],
        buy: [
          {
            name: '대신정보통신',
            price: 1400,
            amount: 714,
          },
        ],
        date: '2020-01-03',
      }}
      daily_profit={100}
      mode={'f'}
    />);
    component.find('button.toggle-expand').simulate('click');
  });
});
