import * as actionTypes from './actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const submitAlgo = (name, descr, snippets) => {
  return async (dispatch) => {
    const data = {
      "name": name,
      "description": descr,
      "snippet_scope": snippets[1],
      "snippet_buy": snippets[2],
      "snippet_sell": snippets[3],
      "snippet_amount": snippets[4]
    };
    try {
      const response = await axios.post('/api/algo', data);
      console.log(response)
      if (response.status === 201) {
        window.alert('Algorithm submitted');
        dispatch({
          type: 'CHANGE_SUBMIT_ALGORITHM',
          data: true
        });
      } else {
        window.alert('Algorithm not submitted');
      }
    } catch (e) {
      window.alert('Algorithm not submitted');
    }
  };
};

