import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '@material-ui/core/Container';

import { LandingPage } from './page/landingPage';
import { DashboardPage } from './page/dashboardPage';
import { WritePage } from './page/writePage';
import { ManagePage } from './page/managePage';
import { MarketPage } from './page/marketPage';

function App(props) {
  // const dispatch = useDispatch();
  const reduxStore = useSelector((s) => s);

  // useEffect(() => {
  //   dispatch(checkLogin())
  // }, [])

  return (
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Container maxWidth="lg">
          {reduxStore.user.loggedIn === true ? (
            <Switch>
              <Route path="/market" exact component={MarketPage} />
              <Route path="/algo/write" exact component={WritePage}/>
              <Route path="/algo/manage" exact component={ManagePage}/>
              <Redirect exact from="/login" to="/dashboard"/>
              <Route path="/dashboard" exact component={DashboardPage}/>
              <Route path="/" exact component={LandingPage}/>
            </Switch>
          ) : (
            <Switch>
              {/*<Route path="/" component={MarketPage}/>*/}
              <Route path="/" exact component={LandingPage}/>
              <Redirect to="/"/>
            </Switch>
          )}
        </Container>
      </div>
    </ConnectedRouter>
  );
}

export default App;
