import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import { TransitionGroup, CSSTransition } from "react-transition-group";
import '../../styles/styles.scss';

import { ClientsList, ClientCreation } from './'

class ClientsRouter extends Component {
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
                  <Route exact path ={ `${path}/clients` } />
                  <Route exact path ={ `${path}/clients/list`  } component={ ClientsList } />
                  <Route exact path ={ `${path}/clients/new`   } component={ ClientCreation } />
                  <Route exact path ={ `${path}/clients/:id`   } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(ClientsRouter);




