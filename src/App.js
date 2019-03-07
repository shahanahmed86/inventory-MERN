import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';

import SignIn from './components/signin';
import SignUp from './components/login/signup';
import Dashboard from './components/dashboard';
import PositionedSnackbar from './components/snackbar';

import actions from './store/actions';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.isLoggedIn();
  }
  render() {
    if (this.props.store.isLoading) return (
      <div className='loader-container'>
        <CircularProgress
          color='secondary'
        />
      </div>
    );
    return (
      <Router>
        <div className='container'>
          <Route path='/' exact component={SignIn} />
          <Route path='/signup' exact component={SignUp} />
          <Route path='/dashboard' component={Dashboard} />
          <PositionedSnackbar />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = store => {
  return { store }
};

const mapDispatchToProps = dispatch => {
  return {
    isLoggedIn: () => dispatch(actions.isLoggedIn()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);