import React from 'react';
import { BacktestRow } from './backtestRow';
import { createMount } from '@material-ui/core/test-utils';

describe('backtestDetailDialog', () => {

  let backtestRow;
  beforeEach(() => {
    backtestRow = (<BacktestRow
      data={{
        id: 3,
        start_date: '00000000000000000000',
        end_date: '00000000000000000000',
        initial_budget: 10000,
        profit: 23,
        MDD: 5,
        alpha: 2,
      }}
      onOpenLog={() => {
      }}
    />);
  });

  it('should render backtestDetailDialog', () => {
    let mount = createMount();
    const component = mount(backtestRow);
    component.find('button#toggle-expand').simulate('click')
    component.find('button#toggle-expand').simulate('click')
  });
});
