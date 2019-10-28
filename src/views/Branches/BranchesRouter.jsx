import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import '../../styles/styles.scss';

import { BranchesList } from './';

class BranchesRouter extends Component {
  
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
                  <Route path ={ `${path}/branches/list`    }  component={ BranchesList } />
                  <Route path ={ `${path}/branches/reports` }  component={ null } />
                  <Route path ={ `${path}/branches/new`     }  component={ null } />
                  <Route path ={ `${path}/branches`         }  component={ null } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(BranchesRouter);



