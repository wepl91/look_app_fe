import React, { lazy, Component, Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { ThemeProvider } from 'react-jss';
import { ToastProvider } from 'react-toast-notifications';

import { AppStore } from './stores';
import AppContext from './AppContext';
import { Loader } from 'shipnow-mercurio';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const AppRouter = lazy(() => import('./views/AppRouter/AppRouter'))
const SessionRouter = lazy(() => import('./views/Session/SessionRouter'));
const loader = <Loader icon={faSpinner} className="fullscreen" label="Cargando aplicación..." animation="spin" />;

import { MyCustomToast } from './components/Toast/Toast';

@observer
class App extends Component {
  constructor(props) {
    super(props);

    this.appStore = new AppStore();
    this.state = {};
  }
  render() {
    return (
      <div>
        <AppContext.Provider value={this.appStore}>
          <ThemeProvider theme={this.appStore.getCurrentTheme()}>
            <React.Fragment>
              <Suspense fallback={loader}>
                {this.appStore.isLoading || this.appStore.isLoggingIn ? loader :
                  <React.Fragment>
                    <ToastProvider className="css-16nn9ah"
                      autoDismissTimeout={6000}
                      placement="bottom-right"
                      components={{ Toast: MyCustomToast }}>
                      <BrowserRouter>
                        <Switch>
                          <Route path={'/app'} component={AppRouter} />
                          <Route path={'/session'} component={SessionRouter} />
                          <Redirect to={'/app'} component={AppRouter} />
                        </Switch>
                      </BrowserRouter>
                    </ToastProvider>
                  </React.Fragment>}
              </Suspense>
            </React.Fragment>
          </ThemeProvider>
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
