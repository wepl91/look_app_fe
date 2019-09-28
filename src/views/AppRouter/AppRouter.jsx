import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';

import withStore from '../../hocs/withStore';

import { SignIn } from '../Session';
import { UsersMenu, UsersRouter } from '../Users'
import { AppointmentsMenu, AppointmentsList, AppointmentsRouter } from '../Appointments';
import { ServicesMenu, ServicesList, ServicesRouter } from '../Services'

import LanguageDropdown from '../../components/LanguageDropdown/LanguageDropdown';

import { 
  Layout, 
  LayoutNavbar, 
  LayoutContent, 
  LayoutMenu,  
  LayoutNavbarEnd,
  LayoutNavbarStart,
  Title 
} from 'shipnow-mercurio'


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
   // if (this.props.store.loggedInUser) {
     if (true) {
      return(
        <React.Fragment>
          <Layout>
            <LayoutNavbar logo="https://thumbs.dreamstime.com/z/logotipo-de-la-barber%C3%ADa-en-c%C3%ADrculo-74419610.jpg">
              <LayoutNavbarStart>

              </LayoutNavbarStart>
              <LayoutNavbarEnd>
               {/* <LanguageDropdown /> */}
              </LayoutNavbarEnd>
            </LayoutNavbar>
            <LayoutMenu>
              <AppointmentsMenu />
              <ServicesMenu />
              <UsersMenu /> 
            </LayoutMenu>
            <LayoutContent>
                <ServicesRouter     />
                <UsersRouter        />
                <AppointmentsRouter />
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