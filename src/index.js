import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NewLocationForm from './components/NewLocationForm.js'
import MainPage from './components/MainPage'


const App = () => {
  return (
    <Router>
      <div>
        <Route exact path='/newlocation' component={NewLocationForm} />
        <Route exact path='/' component={MainPage} />
      </div>
    </Router>

  );
};


ReactDOM.render(
  <App />, document.getElementById('root'));
registerServiceWorker();
