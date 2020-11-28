import React from 'react';
import { NewBackTestForm } from './newBackTestForm';
import { createMount } from '@material-ui/core/test-utils';

describe('newBackTestForm', () => {
  let newBackTestForm;
  beforeEach(() => {
    newBackTestForm = <NewBackTestForm onSubmit={() => {}} />;
  });

  it('should render rowByDateWithLogTable', () => {
    let mount = createMount();
    const component = mount(newBackTestForm);
    // component.find('button.toggle-expand').simulate('click');
    component
      .find('input#newBacktest-startDate')
      .simulate('change', { target: { value: 'test' } });
    component
      .find('input#newBacktest-endDate')
      .simulate('change', { target: { value: 'tesz' } });
    component
      .find('input#newBacktest-startingBudget')
      .simulate('change', { target: { value: '' } });
    component
      .find('input#newBacktest-startingBudget')
      .simulate('change', { target: { value: 0 } });
    component
      .find('input#newBacktest-startingBudget')
      .simulate('change', { target: { value: '1000' } });
    component.find('button#newBacktest-submit').simulate('click');
  });
});
