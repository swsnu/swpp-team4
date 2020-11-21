import { MarketTableRow } from './marketTableRow';
import axios from 'axios';
import { createMount } from '@material-ui/core/test-utils';
import React from 'react';

describe('test MarketTableRow', () => {

  let marketTableRow;
  beforeEach(() => {
    marketTableRow = (
      <MarketTableRow
        id={1}
        name={'test Name'}
        author={'chingis'}
        liked={false}
        onLikedChange={(v) => {
          console.log(v);
        }}
        description={'This is Snippet whatever lorem epsum'}
        code={`for index, candidate in enumerate(scope):
            if index==0:
                chosen_stocks.append(candidate)
                break`}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders MarketTableRow and expand.', () => {
    const component = createMount()(marketTableRow);
    component.find('button.toggle-expand').simulate('click');
    component.find('button.toggle-expand').simulate('click');
  });

  it('test onLikedChange', () => {
    const component = createMount()(marketTableRow);
    component.find('button.toggle-expand').simulate('click');
    component.find('button.toggle-expand').simulate('click');
  });




});
