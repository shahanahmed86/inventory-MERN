import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignIn from './components/signin';
import SignUp from './components/login/signup';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Route path='/' exact component={SignIn} />
          <Route path='/signup' exact component={SignUp} />
        </div>
      </Router>
    );
  }
}

export default App;
