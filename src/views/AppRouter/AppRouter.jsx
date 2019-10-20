import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';

import withStore from '../../hocs/withStore';

import { SignIn } from '../Session';
import { 
  UsersMenu, 
  UsersRouter
} from '../Users'

import { 
  AppointmentsMenu, 
  AppointmentsRouter 
} from '../Appointments';

import { 
  ServicesMenu, 
  ServicesRouter 
} from '../Services';

import { 
  ProfessionalsMenu, 
  ProfessionalsRouter 
} from '../Professionals';

import {
  ClientsMenu,
  ClientsRouter
} from '../Clients'

import LanguageDropdown from '../../components/LanguageDropdown/LanguageDropdown';

import { UserLoggedDropdown } from '../../components/Users';

import { 
  Layout, 
  LayoutNavbar, 
  LayoutContent, 
  LayoutMenu,  
  LayoutNavbarEnd,
  LayoutNavbarStart,
  Title,
  Button
} from 'shipnow-mercurio'

import { faChevronCircleLeft, faChevronCircleRight, faBars } from "@fortawesome/free-solid-svg-icons";

import './style.css'

@observer
class AppRouter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    } 
  }

  render() {
   if (this.props.store.loggedInUser) {
      return(
        <React.Fragment>
          <Layout expandedMenu={ this.state.expanded }>
            <LayoutNavbar>
              <LayoutNavbarStart>
              </LayoutNavbarStart>
              <LayoutNavbarEnd>
               {/* <LanguageDropdown /> */}
               <UserLoggedDropdown user={ this.props.store.loggedInUser }/>
              </LayoutNavbarEnd>
            </LayoutNavbar>
            <LayoutMenu>
              <AppointmentsMenu  />
              <ServicesMenu      />
              <ProfessionalsMenu />
              <UsersMenu         />
              <ClientsMenu       />
              <div className="menu_button">
                <Button kind="link" key={ this.state.expanded } invert size="lg" onClick={ () => (this.setState(preState => ({expanded: !preState.expanded})))} icon={ this.state.expanded ? faBars : faBars }/>
              </div>  
            </LayoutMenu>
            <LayoutContent>
                <AppointmentsRouter  />
                <ServicesRouter      />
                <ProfessionalsRouter />
                <UsersRouter         />
                <ClientsRouter       />
            </LayoutContent>
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