import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import '../../styles/styles.scss';

import {
  ProfessionalsReportView
} from './'

class ReportsRouter extends Component {
  
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
                  <Route path ={ `${path}/reports/professionals`      }  component={ ProfessionalsReportView } />
                  <Route path ={ `${path}/reports/services`           }  component={ null } />
                  <Route path ={ `${path}/reports/professionals` }  component={ null } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(ReportsRouter);




