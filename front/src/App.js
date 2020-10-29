import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Container from '@material-ui/core/Container';

function App(props) {
  const dispatch = useDispatch();
  const reduxStore = useSelector((s) => s);

  // useEffect(() => {
  //   dispatch(checkLogin())
  // }, [])

  return (
    <ConnectedRouter history={props.history}>
      <div className="App">
        <Container>
          {reduxStore.user.userLogin === true ? (
            <Switch>
              <Redirect exact from="/login" to="/dashboard" />
              <Route path="/dashboard" exact component={<>{'Dashboard'}</>} />
              <Route path="/" exact component={<>{'Landing Page'}</>} />
            </Switch>
          ) : (
            <Switch>
              <Route path="/login" exact component={<>{'login Page'}</>} />
              <Redirect to="/" />
            </Switch>
          )}
        </Container>
      </div>
    </ConnectedRouter>
  );
}

export default App;
