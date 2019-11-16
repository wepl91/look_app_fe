import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

import { TransitionGroup, CSSTransition } from "react-transition-group";
import '../../styles/styles.scss';

import { Home } from './';

class HomeRouter extends Component {
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
                  <Route exact path ={ `${path}` } component={ Home }/>
                  <Route exact path ={ `${path}/home` } component={ Home }/>
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(HomeRouter);




