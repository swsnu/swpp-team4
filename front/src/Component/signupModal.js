import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const SignupModal = props => {

  const [Username, setUsername] = React.useState('');
  const [Password, setPassword] = React.useState('');
  const [Email, setEmail] = React.useState('');

  const handleUsernameChange = e => {
    setUsername(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handleSignUpSubmit = async () => {
    const response = await axios.post('/api/sign_up', {username: Username, password: Password, email: Email});
    if (response.status === 201) {
      alert('Signed up successfully');
      props.history.push('/');
    }
    else if (response.status === 400) {
      alert('Username already exists');
    }
  }

  return (
    <div>
      <Paper elevation={3} style={{ padding: 10 }}>
        Username
        <br/>
        <TextField onChange={handleUsernameChange} variant="outlined" size='small'/>
        <br/>
        email
        <br/>
        <TextField onChange={handleEmailChange} variant="outlined" size='small'/>
        <br/>
        Password
        <br/>
        <TextField onChange={handlePasswordChange} variant="outlined" size='small'/>
        <br/>
        <Button onClick={handleSignUpSubmit} fullWidth style={{ marginTop: 10 }}>
          Sign up
        </Button>
      </Paper>
    </div>
  );
};

export default withRouter(SignupModal);
