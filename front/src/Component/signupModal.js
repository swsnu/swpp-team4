import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';

const SignupModal = () => {
  return (
    <div>
      <Paper elevation={3}>
        Username
        <br />
        <TextField variant="outlined" />
        <br />
        email
        <br />
        <TextField variant="outlined" />
        <br />
        Password
        <br />
        <TextField variant="outlined" />
        <br />
        <Button>Sign up</Button>
      </Paper>
    </div>
  );
};

export default withRouter(SignupModal);
