import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';

const SignupModal = () => {
  return (
    <div>
      <Paper elevation={3} style={{ padding: 10 }}>
        Username
        <br/>
        <TextField variant="outlined" size='small'/>
        <br/>
        email
        <br/>
        <TextField variant="outlined" size='small'/>
        <br/>
        Password
        <br/>
        <TextField variant="outlined" size='small'/>
        <br/>
        <Button fullWidth style={{ marginTop: 10 }}>
          Sign up
        </Button>
      </Paper>
    </div>
  );
};

export default withRouter(SignupModal);
