import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NewLocationForm from './components/NewLocationForm.js'
import MainPage from './components/MainPage'
import LoginPage from './components/LoginPage'
import TwitterCallback from './components/TwitterCallback'


const App = () => {
  return (
    <Router>
      <div>
        <Route exact path='/newlocation' component={NewLocationForm} />
        <Route exact path='/main' component={MainPage} />
        <Route exact path='/' component={LoginPage} />
        <Route path='/newlocation/:report_type' component={NewLocationForm} />
        <Route path='/twitter/:token/:verifier' component={TwitterCallback} />
        <Route path='/newreport/:location_id/:report_type' component={MainPage} />
      </div>
    </Router>

  );
};


ReactDOM.render(
  <App />, document.getElementById('root'));
registerServiceWorker();
