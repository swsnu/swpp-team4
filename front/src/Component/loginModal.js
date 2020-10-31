import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actionCreators from '../store/actions/user';

const LoginModal = () => {
  const dispatch = useDispatch();

  const [Username, setUsername] = React.useState('');
  const [Password, setPassword] = React.useState('');

  function handleLoginSubmit() {
    dispatch(actionCreators.sign_in(Username, Password));
  }

  function handleUsernameChange(e) {
    setUsername(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <div>
      <Paper elevation={1}>
        Username
        <br />
        <TextField
          id="id_input"
          variant="outlined"
          value={Username}
          onChange={handleUsernameChange}
        />
        <br />
        Password
        <br />
        <TextField
          id="password_input"
          variant="outlined"
          value={Password}
          onChange={handlePasswordChange}
        />
        <br />
        <Button id="login_button" onClick={handleLoginSubmit}>
          Log in
        </Button>
      </Paper>
    </div>
  );
};

export default withRouter(LoginModal);
