import axios from 'axios';
import { history } from '../../reduxRelated';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const submitAlgo = (name, descr, snippets) => {
  return async (dispatch) => {
    const data = {
      name: name,
      description: descr,
      snippet_scope: snippets[1],
      snippet_buy: snippets[2],
      snippet_sell: snippets[3],
      snippet_amount: snippets[4],
    };
    try {
      const response = await axios.post('/api/algo', data);
      console.log(response);
      if (response.status === 201) {
        dispatch({
          type: 'CHANGE_SUBMIT_ALGORITHM',
          data: true,
        });
        const rb = window.confirm('Algorithm submitted, run backtest?');
        if (rb === true) {
          dispatch({ type: 'CHANGE_LOADING', data: true });
          const response2 = await axios.post('/api/algo/backtest', {
            algo_id: response.data.id,
            budget: 1000000,
            start: '2020-07-05',
            end: '2020-08-05',
          });
          console.log(response2);
          dispatch({
            type: 'CHANGE_LOADING',
            data: false,
          });
        } else {
          history.push('/dashboard');
        }
      } else {
        window.alert('Algorithm not submitted');
      }
    } catch (e) {
      console.log(e);
      window.alert('Algorithm not submitted');
    }
  };
};

const mockAllMyAlgorithm = [
  {
    id: 1,
    name: '1st test algorithm',
    description: 'first test algorithm',
    author: 2,
    is_public: false,
    snippet_scope: 13,
    snippet_sell: 14,
    snippet_buy: 15,
    snippet_amount: 16,
    create_at: '2020-11-09T18:05:30.427122Z',
    update_at: '2020-11-09T18:05:30.427122Z',
    snippet_scope_data: {
      code:
        'scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), universe.query(\'(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)\').to_numpy()))',
      name: '1st test algorithm: scope',
      description: 'first test scope',
      author: 2,
      is_shared: false,
      type: 'scope',
    },
    snippet_sell_data: {
      code:
        'for index, candidate in enumerate(sell_candidates):\r\n            if (self.universe.loc[self.universe[\'code\'] == str(int(candidate.get_id()))].iloc[0][\'close\'])/candidate.avg_purchase_price-1>0.05:\r\n                chosen_stocks.append(candidate)',
      name: '1st test algorithm: sell',
      description: 'first test sell',
      author: 2,
      is_shared: false,
      type: 'sell',
    },
    snippet_buy_data: {
      code:
        'for index, candidate in enumerate(scope):\r\n            if index==0:\r\n                chosen_stocks.append(candidate)\r\n                break',
      name: '1st test algorithm: buy',
      description: 'first test buy',
      author: 2,
      is_shared: false,
      type: 'buy',
    },
    snippet_amount_data: {
      code:
        'if opt == "buy":\r\n    for stock in chosen_stocks:\r\n        buy_amount_list.append((stock, int(self.wallet.budget/stock.get_price())))\r\nelse:\r\n    for stock in chosen_stocks:\r\n        sell_amount_list.append((stock, stock.get_amount()))',
      name: '1st test algorithm: amount',
      description: 'first test amount',
      author: 2,
      is_shared: false,
      type: 'amount',
    },
  },
  {
    id: 2,
    name: '2nd test algorithm',
    description: 'second test algorithm',
    author: 2,
    is_public: false,
    snippet_scope: 13,
    snippet_sell: 14,
    snippet_buy: 15,
    snippet_amount: 16,
    create_at: '2020-11-09T18:06:13.244504Z',
    update_at: '2020-11-09T18:06:13.244504Z',
    snippet_scope_data: {
      code:
        'scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), universe.query(\'(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)\').to_numpy()))',
      name: '1st test algorithm: scope',
      description: 'first test scope',
      author: 2,
      is_shared: false,
      type: 'scope',
    },
    snippet_sell_data: {
      code:
        'for index, candidate in enumerate(sell_candidates):\r\n            if (self.universe.loc[self.universe[\'code\'] == str(int(candidate.get_id()))].iloc[0][\'close\'])/candidate.avg_purchase_price-1>0.05:\r\n                chosen_stocks.append(candidate)',
      name: '1st test algorithm: sell',
      description: 'first test sell',
      author: 2,
      is_shared: false,
      type: 'sell',
    },
    snippet_buy_data: {
      code:
        'for index, candidate in enumerate(scope):\r\n            if index==0:\r\n                chosen_stocks.append(candidate)\r\n                break',
      name: '1st test algorithm: buy',
      description: 'first test buy',
      author: 2,
      is_shared: false,
      type: 'buy',
    },
    snippet_amount_data: {
      code:
        'if opt == "buy":\r\n    for stock in chosen_stocks:\r\n        buy_amount_list.append((stock, int(self.wallet.budget/stock.get_price())))\r\nelse:\r\n    for stock in chosen_stocks:\r\n        sell_amount_list.append((stock, stock.get_amount()))',
      name: '1st test algorithm: amount',
      description: 'first test amount',
      author: 2,
      is_shared: false,
      type: 'amount',
    },
  },
  {
    id: 3,
    name: '3rd test algorithm',
    description: 'third test algorithm',
    author: 2,
    is_public: false,
    snippet_scope: 13,
    snippet_sell: 14,
    snippet_buy: 15,
    snippet_amount: 16,
    create_at: '2020-11-09T18:47:24.136800Z',
    update_at: '2020-11-09T18:47:24.136800Z',
    snippet_scope_data: {
      code:
        'scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), universe.query(\'(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)\').to_numpy()))',
      name: '1st test algorithm: scope',
      description: 'first test scope',
      author: 2,
      is_shared: false,
      type: 'scope',
    },
    snippet_sell_data: {
      code:
        'for index, candidate in enumerate(sell_candidates):\r\n            if (self.universe.loc[self.universe[\'code\'] == str(int(candidate.get_id()))].iloc[0][\'close\'])/candidate.avg_purchase_price-1>0.05:\r\n                chosen_stocks.append(candidate)',
      name: '1st test algorithm: sell',
      description: 'first test sell',
      author: 2,
      is_shared: false,
      type: 'sell',
    },
    snippet_buy_data: {
      code:
        'for index, candidate in enumerate(scope):\r\n            if index==0:\r\n                chosen_stocks.append(candidate)\r\n                break',
      name: '1st test algorithm: buy',
      description: 'first test buy',
      author: 2,
      is_shared: false,
      type: 'buy',
    },
    snippet_amount_data: {
      code:
        'if opt == "buy":\r\n    for stock in chosen_stocks:\r\n        buy_amount_list.append((stock, int(self.wallet.budget/stock.get_price())))\r\nelse:\r\n    for stock in chosen_stocks:\r\n        sell_amount_list.append((stock, stock.get_amount()))',
      name: '1st test algorithm: amount',
      description: 'first test amount',
      author: 2,
      is_shared: false,
      type: 'amount',
    },
  },
  {
    id: 4,
    name: '4th test algorithm',
    description: 'fourth test algorithm',
    author: 2,
    is_public: false,
    snippet_scope: 13,
    snippet_sell: 14,
    snippet_buy: 15,
    snippet_amount: 16,
    create_at: '2020-11-09T19:05:46.443277Z',
    update_at: '2020-11-09T19:05:46.443277Z',
    snippet_scope_data: {
      code:
        'scope = list(map(lambda stock: Stock(name=stock[2], stock_id=stock[1], price=stock[4]), universe.query(\'(yes_clo_5 < yes_clo_20) and (clo5 > clo20) and (volume >5000000)\').to_numpy()))',
      name: '1st test algorithm: scope',
      description: 'first test scope',
      author: 2,
      is_shared: false,
      type: 'scope',
    },
    snippet_sell_data: {
      code:
        'for index, candidate in enumerate(sell_candidates):\r\n            if (self.universe.loc[self.universe[\'code\'] == str(int(candidate.get_id()))].iloc[0][\'close\'])/candidate.avg_purchase_price-1>0.05:\r\n                chosen_stocks.append(candidate)',
      name: '1st test algorithm: sell',
      description: 'first test sell',
      author: 2,
      is_shared: false,
      type: 'sell',
    },
    snippet_buy_data: {
      code:
        'for index, candidate in enumerate(scope):\r\n            if index==0:\r\n                chosen_stocks.append(candidate)\r\n                break',
      name: '1st test algorithm: buy',
      description: 'first test buy',
      author: 2,
      is_shared: false,
      type: 'buy',
    },
    snippet_amount_data: {
      code:
        'if opt == "buy":\r\n    for stock in chosen_stocks:\r\n        buy_amount_list.append((stock, int(self.wallet.budget/stock.get_price())))\r\nelse:\r\n    for stock in chosen_stocks:\r\n        sell_amount_list.append((stock, stock.get_amount()))',
      name: '1st test algorithm: amount',
      description: 'first test amount',
      author: 2,
      is_shared: false,
      type: 'amount',
    },
  },
];
console.log(mockAllMyAlgorithm);

export const getAllAlgorithm = () => {
  // GET all algorithms and put it to algo.ownedAlgorithmList
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/algo/sort');
      dispatch({
        type: 'GET_ALL_ALGORITHM',
        data: response.data,
      });
    } catch (e) {
      /* istanbul ignore next */
      console.log(e);
    }
  };
};

export const getAllMyAlgorithm = () => {
  // GET all algorithms and put it to algo.ownedAlgorithmList
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/algo/me');
      dispatch({
        type: 'GET_OWNED_ALGORITHM',
        data: response.data,
      });
    } catch (e) {
      /* istanbul ignore next */
      console.log(e);
    }
  };
};

export const deleteAlgo = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/algo/${id}`);
      dispatch({
        type: 'DELETE_ALGORITHM',
        data: id,
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const shareAlgo = (id, share) => {
  return async (dispatch) => {
    try {
      const response = await axios.put('/api/algo/' + id, { public: share });
      if (response.status === 200) {
        if (share) {
          dispatch({
            type: 'ADD_SHARED_ALGORITHM',
            data: response.data,
          });
        } else {
          dispatch({
            type: 'DELETE_SHARED_ALGORITHM',
            data: response.data,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
};
