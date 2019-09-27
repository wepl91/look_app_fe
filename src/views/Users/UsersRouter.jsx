import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import { TransitionGroup, CSSTransition } from "react-transition-group";

class UsersRouter extends Component {

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
                  <Route path ={ `${path}/users`         }  component={ null } />
                  <Route path ={ `${path}/users/list`    }  component={ null } />
                  <Route path ={ `${path}/users/new`     }  component={ null } />
                  <Route path ={ `${path}/users/:id`     }  component={ null } />
                  
                  <Redirect to={`${this.props.match.path}/users`} component={ null } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(UsersRouter);




