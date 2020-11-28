import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {useSelector} from 'react-redux';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {withRouter} from 'react-router-dom';
import LoginModal from './loginModal';
import SignupModal from './signupModal';
import {useDispatch} from 'react-redux';
import * as actionCreators from "../store/actions/user";

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  button: {
    marginLeft: 'auto',
  },
}));

export const MenuBar = (props) => {
  const reduxStore = useSelector((s) => s);
  const dispatch = useDispatch();

  const classes = useStyles();

  const [logInAnchorEl, setLogInAnchorEl] = React.useState(null);
  const logInOpen = Boolean(logInAnchorEl);
  const handleLogInClick = (event) => {
    setLogInAnchorEl(event.currentTarget);
  };

  /* istanbul ignore next */
  const handleLogInClose = () => {
    setLogInAnchorEl(null);
  };

  const [signUpAnchorEl, setSignUpAnchorEl] = React.useState(null);
  const handleSignUpClick = (event) => {
    setSignUpAnchorEl(event.currentTarget);
  };

  /* istanbul ignore next */
  const handleSignUpClose = () => {
    setSignUpAnchorEl(null);
  };
  const signUpOpen = Boolean(signUpAnchorEl);

  const handleLogOut = () => {
    dispatch(actionCreators.sign_out());
  }

  return (
    <div className='MenuBar' style={{height: 70}}>
      <AppBar style={{background: 'transparent', boxShadow: 'none'}}>
        <Toolbar>
          <Button id='logo_button' onClick={() => props.history.push('/')}>
            <Typography>QuantCash</Typography>
          </Button>
          <div className={classes.grow}/>
          <Button
            id='leaderboard_button'
            onClick={() => {
              props.history.push('/leaderboard');
            }}
            className={classes.button}
          >
            Leaderboard
          </Button>
          {reduxStore.user.loggedIn === false ? (
            <div>
              <Button id='login_button' onClick={handleLogInClick}>
                Log in
              </Button>
              <Popover
                open={logInOpen}
                anchorEl={logInAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={handleLogInClose}
              >
                <LoginModal/>
              </Popover>
              <Button id='signup_button' onClick={handleSignUpClick}>
                Sign up
              </Button>
              <Popover
                open={signUpOpen}
                anchorEl={signUpAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={handleSignUpClose}
              >
                <SignupModal/>
              </Popover>
            </div>
          ) : (
            <div>
              <Button
                id='dashboard_button'
                onClick={() => {
                  props.history.push('/dashboard');
                }}
                className={classes.button}
              >
                Dashboard
              </Button>
              <Button
                id='market_button'
                onClick={() => {
                  props.history.push('/market');
                }}
                className={classes.button}
              >
                Snippet market
              </Button>
              <Button
                id='algo_manage_button'
                onClick={() => {
                  props.history.push('/algo/manage');
                }}
                className={classes.button}
              >
                Manage algo
              </Button>
              <Button id='data_manage_button' onClick={() => {
              }} className={classes.button}>
                Manage data
              </Button>
              <Button
                id='logout_button'
                onClick={handleLogOut}
                className={classes.button}
              >
                Log out
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(MenuBar);
