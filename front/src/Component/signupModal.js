import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

export const SignupModal = props => {

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
    try {
      const response = await axios.post('/api/sign_up', {username: Username, password: Password, email: Email});
      window.alert('Signed up successfully');
      props.history.push('/');
    } catch(e) {
      window.alert('Username already exists');
    }
  }

  return (
    <div className='SignupModal'>
      <Paper elevation={3} style={{ padding: 10 }}>
        Username
        <br/>
        <TextField id='id_input' onChange={handleUsernameChange} variant="outlined" size='small'/>
        <br/>
        email
        <br/>
        <TextField id='email_input' onChange={handleEmailChange} variant="outlined" size='small'/>
        <br/>
        Password
        <br/>
        <TextField id='password_input' onChange={handlePasswordChange} variant="outlined" size='small'/>
        <br/>
        <Button id='sign_up_button' onClick={handleSignUpSubmit} fullWidth style={{ marginTop: 10 }}>
          Sign up
        </Button>
      </Paper>
    </div>
  );
};

export default withRouter(SignupModal);
