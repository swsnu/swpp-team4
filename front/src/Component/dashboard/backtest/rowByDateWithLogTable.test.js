import React from 'react';
import { RowByDateWithLogTable } from './rowByDateWithLogTable';
import { createMount } from '@material-ui/core/test-utils';

describe('backtestDetailDialog', () => {
  let rowByDateWithLogTable;
  beforeEach(() => {
    rowByDateWithLogTable = (
      <RowByDateWithLogTable
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
      />
    );
  });

  it('should render rowByDateWithLogTable', () => {
    let mount = createMount();
    const component = mount(rowByDateWithLogTable);
    component.find('button.toggle-expand').simulate('click');
  });
});
