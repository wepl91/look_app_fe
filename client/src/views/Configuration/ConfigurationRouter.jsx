import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { 
  ConfigurationDBView,
  ConfigurationPointView,
 } from './'

import '../../styles/styles.scss';

class ConfigurationRouter extends Component {
  
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
                  <Route exact path ={ `${path}/configuration/data_base` }  component={ ConfigurationDBView } />
                  <Route exact path ={ `${path}/configuration/points`    }  component={ ConfigurationPointView } />
                  <Route path ={ `${path}/configuration`           }  component={ ConfigurationPointView } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(ConfigurationRouter);




