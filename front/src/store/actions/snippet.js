import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const submitSnippet = (name, descr, type, code) => {
  return async (dispatch) => {
    const data = {
      "name": name,
      "description": descr,
      "type": type,
      "code": code
    };
    const response = await axios.post('/api/snippet', data);
    console.log(response)
    if (response.status === 201) {
      dispatch({
        type: 'ADD_OWNED_SNIPPET',
        data: data
      });
    } else {
      dispatch({
        type: 'NO_ACTION'
      })
    }
  };
};

