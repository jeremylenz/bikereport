import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NewLocationForm from './components/NewLocationForm.js'
import MainPage from './components/MainPage'
import LoginPage from './components/LoginPage'
import TwitterCallback from './components/TwitterCallback'
import FacebookCallback from './components/FacebookCallback'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import bwReducers from './reducers/reducers.js'

const store = createStore(
   bwReducers, /* preloadedState, */
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Route exact path='/newlocation' component={NewLocationForm} />
          <Route exact path='/main' component={MainPage} />
          <Route exact path='/' component={LoginPage} />
          <Route path='/newlocation/:report_type' component={NewLocationForm} />
          <Route path='/twitter/:token/:verifier' component={TwitterCallback} />
          <Route path='/newreport/:location_id/:report_type' component={MainPage} />
          <Route path='/facebook' component={FacebookCallback} />

        </div>
      </Router>
    </Provider>

  );
};


ReactDOM.render(
  <App />, document.getElementById('root'));
registerServiceWorker();
