import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Container from '@material-ui/core/Container';
import { LandingPage } from './page/landingPage';
import { LoginPage } from './page/loginPage';
import { DashboardPage } from './page/dashboardPage';

function App(props) {
  // const dispatch = useDispatch();
  const reduxStore = useSelector((s) => s);

  // useEffect(() => {
  //   dispatch(checkLogin())
  // }, [])

  return (
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Container>
          {reduxStore.user.loggedIn === true ? (
            <Switch>
              <Redirect exact from="/login" to="/dashboard" />
              <Route path="/dashboard" exact component={DashboardPage} />
              <Route path="/" exact component={LandingPage} />
            </Switch>
          ) : (
            <Switch>
              <Route path="/login" exact component={LoginPage} />
              <Route path="/" exact component={LandingPage} />
              <Redirect to="/" />
            </Switch>
          )}
        </Container>
      </div>
    </ConnectedRouter>
  );
}

export default App;
