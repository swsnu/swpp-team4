import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import MenuBar from '../Component/menuBar';
import { bigLogo, explain, getStarted } from '../static';

export const LandingPage = () => {
  return (
    <div className="LandingPage">
      <MenuBar />
      <img src={bigLogo} style={{ marginTop: 200, width: '40%' }} />
      <br />
      <img src={explain} style={{ marginTop: 10, width: '30%' }} />
      <br />
      <Button>
        <img src={getStarted} style={{ marginTop: 20, width: '70%' }} />
      </Button>
    </div>
  );
};
