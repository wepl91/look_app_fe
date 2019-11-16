import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { ServicesList, ServiceCreation } from './'
import '../../styles/styles.scss';

class ServicesRouter extends Component {
  
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
                  <Route path ={ `${path}/services/list` }  component={ ServicesList    } />
                  <Route path ={ `${path}/services/new`  }  component={ ServiceCreation } />
                  <Route path ={ `${path}/services`      }  component={ ServicesList    } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(ServicesRouter);




