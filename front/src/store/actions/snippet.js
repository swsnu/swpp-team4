import * as actionTypes from './actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const submitSnippet = (name, descr, type, code, index) => {
  return async (dispatch) => {
    const data = {
      "name": name,
      "description": descr,
      "type": type,
      "code": code
    };
    try {
      const response = await axios.post('/api/snippet', data);
      console.log(response)
      if (response.status === 201) {
        window.alert('snippet submitted');
        dispatch({
          type: 'ADD_OWNED_SNIPPET',
          data: data
        });
        dispatch({
          type: 'SUBMIT_SNIPPET',
          data: {
            index: index,
            value: response.data.id
          }
        });
      } else {
        window.alert('snippet submit failed');
        dispatch({
          type: 'NO_ACTION'
        })
      }
    } catch (e) {
      window.alert('snippet submit failed');
      dispatch({
        type: 'NO_ACTION'
      })
    }
  };
};

