import * as actionTypes from "./actionTypes";
import axios from "axios";
import {
  initializePushNotifications,
  isPushNotificationSupported,
  registerServiceWorker,
  subscribe
} from "../../push-notification";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const sign_in = (username, password) => {
  return async (dispatch) => {
    const data = {
      username: username,
      password: password,
    };
    try {
      await axios.post('/api/sign_in', data);
      const userInfo = {
        username: username,
        password: password,
      };
      dispatch({
        type: actionTypes.SIGN_IN,
        userInfo: userInfo,
        loggedIn: true,
      });


      const pushNotificationSuported = isPushNotificationSupported();

      if (pushNotificationSuported) {
        const reg = await registerServiceWorker();
        console.log("reg!!!", reg);
        initializePushNotifications().then(function(consent){
          if(consent === 'granted') {
            //sendNotification();
            subscribe(reg);
            console.log("notification sent motherfucker!!!!");
          }
        });
      }

    } catch(error) {
      alert('email or password is wrong');
      // TODO
    }
  };
};

export const sign_out = () => {
  return async (dispatch) => {
    await axios.get('/api/sign_out');
    dispatch({ type: 'SIGN_OUT', loggedIn: false });
  };
};
