import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import { TransitionGroup, CSSTransition } from "react-transition-group";
import { UsersList } from './'
import '../../styles/styles.scss';

class UsersRouter extends Component {
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
                  <Route exact path ={ `${path}/users` } />
                  <Route exact path ={ `${path}/users/list`  } component={ UsersList }/>
                  <Route exact path ={ `${path}/users/new`   } />
                  <Route exact path ={ `${path}/users/:id`   } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(UsersRouter);




