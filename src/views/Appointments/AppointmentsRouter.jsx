import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { AppointmentsList } from './';

class AppointmentsRouter extends Component {

  render() {
    const path = this.props.match.path;
    const location = this.props.location;
    return(
        <TransitionGroup className="transition-group">
          <CSSTransition 
            key={location.pathname}
            timeout={300}          
            classNames="sectionTransition">
              <section className="transition-wrapper">
                <Switch location={ location }>
                  <Route exact path ={ `${path}/appointments`      }  component={ AppointmentsList } />
                  <Route exact path ={ `${path}/appointments/list` }  component={ AppointmentsList } />
                  
                  <Redirect to={`${this.props.match.path}/user`} component={ AppointmentsList } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(AppointmentsRouter);




