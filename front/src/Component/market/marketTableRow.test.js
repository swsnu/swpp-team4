import React from 'react';
import { MarketTableRow } from './marketTableRow';
import { createMount } from '@material-ui/core/test-utils';
import * as cmr2 from 'react-codemirror2';

describe('test MarketTableRow', () => {
  let marketTableRow, marketTableRow2;

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
    marketTableRow2 = (
      <MarketTableRow
        id={1}
        name={'test Name'}
        author={'chingis'}
        liked={true}
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
    jest
      .spyOn(cmr2, 'Controlled')
      .mockImplementation(() => <>Mock Component :)</>);

    const component = createMount()(marketTableRow);
    console.log(component.debug());
    component.find('button.toggle-expand').simulate('click');
  });

  it('test onLikedChange', () => {
    const component = createMount()(marketTableRow);
    createMount()(marketTableRow2);
    component.find('button.toggle-like').simulate('click');
    component.find('button.toggle-like').simulate('click');
  });
});
