import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export const submitSnippet = (name, descr, type, code, index) => {
  return async (dispatch) => {
    const data = {
      name: name,
      description: descr,
      type: type,
      code: code,
    };
    try {
      const response = await axios.post('/api/snippet', data);
      console.log(response);
      if (response.status === 201) {
        window.alert('snippet submitted');
        dispatch({
          type: 'ADD_OWNED_SNIPPET',
          data: data,
        });
        dispatch({
          type: 'SUBMIT_SNIPPET',
          data: {
            index: index,
            value: response.data.id,
          },
        });
      } else {
        window.alert('snippet submit failed');
        dispatch({
          type: 'NO_ACTION',
        });
      }
    } catch (e) {
      window.alert('snippet submit failed');
      dispatch({
        type: 'NO_ACTION',
      });
    }
  };
};

export const getAllMySnippets = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/snippet/me');
      if (response.status === 200) {
        dispatch({
          type: 'GET_OWNED_SNIPPET',
          data: response.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const getLikedSnippets = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/like/snippet');
      if (response.status === 200) {
        dispatch({
          type: 'GET_LIKED_SNIPPET',
          data: response.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const likeSnippet = (id, like) => {
  return async (dispatch) => {
    try {
      const response = await axios.put('/api/like/snippet/' + id, {
        like: like,
      });
      if (response.status === 200) {
        if (like) {
          dispatch({
            type: 'LIKE_SNIPPET',
            data: response.data,
          });
        } else {
          dispatch({
            type: 'UNLIKE_SNIPPET',
            data: response.data,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const shareSnippet = (id, share) => {
  return async (dispatch) => {
    try {
      const response = await axios.put('/api/snippet/' + id, { public: share });
      if (response.status === 200) {
        if (share) {
          dispatch({
            type: 'ADD_SHARED_SNIPPET',
            data: id,
          });
        } else {
          dispatch({
            type: 'DELETE_SHARED_SNIPPET',
            data: id,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
};
