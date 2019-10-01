import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Columns, Column } from 'bloomer';
import { observer } from 'mobx-react';

import withStore from '../../hocs/withStore';

// pages
import { SignIn } from './';

import AppRouter from '../AppRouter/AppRouter';

import '../../styles/styles.scss';

@observer
class SessionRouter extends Component {

  componentDidMount() {
    document.title = `LookApp`;
  }

  render() {
    // not logged in or confirmation page
    if (!this.props.store.isLoggedIn && !this.props.store.isLoggingIn) {

      return (
        <Columns isVCentered isCentered isMobile style={{ height: '100vh' }}>
          <Column isSize={ 4 }>
            <Switch>
              {/* <Route exact path={`${this.props.match.path}/signup`}        component={SignUp} /> */}
              <Route exact path={`${this.props.match.path}/signin`}        component={SignIn} />

              <Redirect to={`${this.props.match.path}/signin`}             component={SignIn} />
            </Switch>
          </Column>
        </Columns>);
    }

    // already logged in
    return (
      <Switch>
        <Redirect to={`/app`} component={AppRouter} />
      </Switch>
    );

  }
}

export default withStore(withRouter(SessionRouter));
