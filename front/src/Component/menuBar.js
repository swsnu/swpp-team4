import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { useSelector } from 'react-redux';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';

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

  const classes = useStyles();
  const [logInAnchorEl, setLogInAnchorEl] = React.useState(null);
  const [signUpAnchorEl, setSignUpAnchorEl] = React.useState(null);

  const handleLogInClick = (event) => {
    setLogInAnchorEl(event.currentTarget);
  };
  const handleLogInClose = () => {
    setLogInAnchorEl(null);
  };
  const handleSignUpClick = (event) => {
    setSignUpAnchorEl(event.currentTarget);
  };
  const handleSignUpClose = () => {
    setSignUpAnchorEl(null);
  };

  const logInOpen = Boolean(logInAnchorEl);
  const signUpOpen = Boolean(signUpAnchorEl);

  return (
    <div>
      <AppBar style={{ background: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <Button>
            <Typography>QuantCash</Typography>
          </Button>
          <div className={classes.grow} />
          <Button
            onClick={() => {
              props.history.push('/leaderboard');
            }}
            className={classes.button}
          >
            Leaderboard
          </Button>
          {reduxStore.user.loggedIn === false ? (
            <div className={classes.button}>
              <Button onClick={handleLogInClick} className={classes.button}>
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
                <Paper elevation={3}>
                  Username
                  <br />
                  <TextField variant="outlined" />
                  <br />
                  Password
                  <br />
                  <TextField variant="outlined" />
                  <br />
                  <Button>Log in</Button>
                </Paper>
              </Popover>
              <Button onClick={handleSignUpClick} className={classes.button}>
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
              </Popover>
            </div>
          ) : (
            <div>
              <Button
                onClick={() => {
                  props.history.push('/Dashboard');
                }}
                className={classes.button}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  props.history.push('/');
                }}
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
