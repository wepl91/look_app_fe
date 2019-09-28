import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Title } from 'shipnow-mercurio';

import { AppointmentsList } from './';

import '../../styles/styles.scss';

class AppointmentsRouter extends Component {
  
  render() {
   
    const path = this.props.match.path;
    const location = this.props.location;
    return(
        <TransitionGroup className="transition-group">
          <CSSTransition 
            key={location.pathname}
            timeout={700}          
            classNames="sectionTransition">
              <section className="transition-wrapper">
                <Switch location={ location }>
                  <Route path ={ `${path}/appointments/list`    }  component={ AppointmentsList } />
                  <Route path ={ `${path}/appointments/reports` }  component={ null } />
                  <Route path ={ `${path}/appointments`   }  component={ AppointmentsList } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(AppointmentsRouter);




