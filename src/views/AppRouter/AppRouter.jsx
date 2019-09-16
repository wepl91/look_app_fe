import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';
import debounce from 'lodash/debounce';

import withStore from '../../hocs/withStore';

import { SignIn } from '../Session';

import { UsersMenu } from '../Users'

import { 
    Layout, 
    LayoutNavbar, 
    LayoutContent, 
    LayoutMenu,  
    LayoutNavbarEnd,
    LayoutNavbarStart } from 'shipnow-mercurio'

const FakeContent = withRouter( (props) => (
  <div>
    <Title>{ props.location.pathname }</Title>
  </div>
));

@observer
class AppRouter extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    if (this.props.store.loggedInUser) {
      return(
        <React.Fragment>
          <Layout>
            <LayoutNavbar>
              <LayoutNavbarStart>

              </LayoutNavbarStart>
              <LayoutNavbarEnd>

              </LayoutNavbarEnd>
            </LayoutNavbar>
            <LayoutContent>
              <Switch>
                <Route exact path={`${this.props.match.path}/home`} component={ FakeContent } />
              </Switch>
            </LayoutContent>
            <LayoutMenu>
              <UsersMenu />
            </LayoutMenu>
          </Layout>
        </React.Fragment> )
    }
    else {
      return (
        <Switch>
          <Redirect to={`/session/signin`} component={ SignIn } /> 
        </Switch>
        );
    }
  }
}

export default withStore(withRouter(AppRouter));