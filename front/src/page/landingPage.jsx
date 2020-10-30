import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { MenuBar } from '../Component/menuBar';

export const LandingPage = () => {
  const history = useHistory();

  return (
    <div>
      <MenuBar />
    </div>
  );
};
