import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

export const LandingPage = () => {
  const history = useHistory();

  return (
    <>
      This is Landing Page. Now work and fill this.
      <br />
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={() => {
          history.push('login');
        }}
      >
        To Login Page
      </Button>
      <br />
      <br />
      <Button
        color={'primary'}
        variant={'contained'}
        onClick={() => {
          history.push('dashboard');
        }}
      >
        To Dashboard
      </Button>
    </>
  );
};
