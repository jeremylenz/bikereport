import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import NewLocationForm from './components/NewLocationForm.js'


const App = () => {
  return (
    <Router>
      <div>
        <Route exact path='/' component={NewLocationForm} />
      </div>
    </Router>

  );
};


ReactDOM.render(
  <App />, document.getElementById('root'));
registerServiceWorker();
