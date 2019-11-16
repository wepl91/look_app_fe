import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { DiscountsList, DiscountCreation } from './'
import '../../styles/styles.scss';

class DiscountsRouter extends Component {
  
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
                  <Route path ={ `${path}/discounts/list` }  component={ DiscountsList    } />
                  <Route path ={ `${path}/discounts/new`  }  component={ DiscountCreation } />
                  <Route path ={ `${path}/discounts`      }  component={ DiscountsList    } />
                </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      );
  };

}

export default withRouter(DiscountsRouter);