import React, { lazy,Component, Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { ThemeProvider } from 'react-jss';

import { AppStore } from './stores';
import AppContext from './AppContext';
import { Loader } from 'shipnow-mercurio';
const AppRouter = lazy( () => import('./views/AppRouter/AppRouter')) 
const SessionRouter = lazy( () => import('./views/Session/SessionRouter'));
const loader = <Loader className="fullscreen" label="Cargando aplicación..." icon="cog" animation="spin"  /> ;


class App extends Component {
  constructor(props) {
    super(props);

    this.appStore = new AppStore();
    this.state = {};
  }
  render() {
    return (
      <div>
        <AppContext.Provider value={ this.appStore }>
          <ThemeProvider theme={ this.appStore.getCurrentTheme() }>
            <React.Fragment>
              <Suspense fallback={ loader }>
                { this.appStore.isLoading || this.appStore.isLoggingIn ? loader :
                  <React.Fragment>
                    <BrowserRouter>
                    <Switch>
                      <Route  path = {'/app'     } component={ AppRouter } />
                      <Route  path = {'/session' } component={ SessionRouter } />
                      <Redirect to = {'/app'     } component={ AppRouter } />
                    </Switch>
                        </BrowserRouter>
                  </React.Fragment> }
              </Suspense>
            </React.Fragment>
          </ThemeProvider>
        </AppContext.Provider> 
        </div> );
  }
}

export default App;
