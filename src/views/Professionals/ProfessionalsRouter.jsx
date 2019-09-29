import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { ProfessionalsList, ProfessionalCreation } from './'
import '../../styles/styles.scss';

class ProfessionalsRouter extends Component {
  
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
                  <Route path ={ `${path}/professionals/list` }  component={ ProfessionalsList    } />
                  <Route path ={ `${path}/professionals/new`  }  component={ ProfessionalCreation } />
                  <Route path ={ `${path}/professionals`      }  component={ ProfessionalsList    } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(ProfessionalsRouter);