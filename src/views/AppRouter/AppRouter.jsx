import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { observer } from 'mobx-react';

import withStore from '../../hocs/withStore';

import { SignIn } from '../Session';
import { UsersMenu, UsersRouter } from '../Users'
import { AppointmentsMenu, AppointmentsList, AppointmentsRouter } from '../Appointments';
import { ServicesMenu, ServicesList, ServicesRouter } from '../Services'
import { ProfessionalsMenu, ProfessionalsList, ProfessionalsRouter } from '../Professionals'

import LanguageDropdown from '../../components/LanguageDropdown/LanguageDropdown';

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

import { faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

import './style.css'

const FakeContent = withRouter( (props) => (
  <div>
    <Title>{ props.location.pathname }</Title>
  </div>
));
@observer
class AppRouter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    } 
  }

  render() {
   // if (this.props.store.loggedInUser) {
     if (true) {
      return(
        <React.Fragment>
          <Layout expandedMenu={ this.state.expanded }>
            <LayoutNavbar logo="https://thumbs.dreamstime.com/z/logotipo-de-la-barber%C3%ADa-en-c%C3%ADrculo-74419610.jpg">
              <LayoutNavbarStart>

              </LayoutNavbarStart>
              <LayoutNavbarEnd>
               {/* <LanguageDropdown /> */}
              </LayoutNavbarEnd>
            </LayoutNavbar>
            <LayoutMenu>
              <AppointmentsMenu  />
              <ServicesMenu      />
              <ProfessionalsMenu />
              <UsersMenu         />
              <div className={ this.state.expanded ? 'menu_button_expanded' : 'menu_button' }>
                <Button kind="link" key={ this.state.expanded } invert size="lg" onClick={ () => (this.setState(preState => ({expanded: !preState.expanded})))} icon={ this.state.expanded ? faChevronCircleRight : faChevronCircleLeft }/>
              </div>  
            </LayoutMenu>
            <LayoutContent>
                <AppointmentsRouter  />
                <ServicesRouter      />
                <ProfessionalsRouter />
                <UsersRouter         />
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