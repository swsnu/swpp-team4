import { MarketPage } from './marketPage';
import axios from 'axios';
import { createMount } from '@material-ui/core/test-utils';
import React from 'react';

describe('test marketPage', () => {

  // let marketPage;
  beforeEach(() => {
    // marketPage = (
    // <Provider store={mockStore}>
    //   <ConnectedRouter history={history}>
    //     <Switch>
    //       <Route path='/' component={MarketPage}/>
    //     </Switch>
    //   </ConnectedRouter>
    // </Provider>
    // );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders marketPage', () => {
    const component = createMount()(<MarketPage/>);

  });


});
