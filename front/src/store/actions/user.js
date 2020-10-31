import * as actionTypes from './actionTypes';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const sign_in = (username, password) => {
  return async (dispatch) => {
    const data = {
      username: username,
      password: password,
    };
    const response = await axios.post('/api/sign_in', data);
    if (response.status === 204) {
      const userInfo = {
        username: username,
        password: password,
      };
      dispatch({
        type: actionTypes.SIGN_IN,
        userInfo: userInfo,
        loggedIn: true,
      });
    } else {
      alert('email or password is wrong');
    }
  };
};
