import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import actions from '../store/actions';

class Header extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <Link
            to='/dashboard'
            className="navbar-brand"
            children='Dashboard'
          />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsExample09">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <Link
                  to='/dashboard'
                  children='Main'
                  id="dropdown09"
                  className="nav-link active dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="dropdown-menu" aria-labelledby="dropdown09">
                  <Link
                    to='/dashboard/product'
                    children='Product'
                    className='dropdown-item'
                  />
                  <Link
                    to='/dashboard/vendor'
                    children='Vendor'
                    className='dropdown-item'
                  />
                  <Link
                    to='/dashboard/client'
                    children='Client'
                    className='dropdown-item'
                  />
                </div>
              </li>
              <li className="nav-item dropdown">
                <Link
                  to='/dashboard'
                  children='Transaction'
                  id="dropdown09"
                  className="nav-link active dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                />
                <div className="dropdown-menu" aria-labelledby="dropdown09">
                  <Link
                    to='/dashboard/purchase'
                    children='Purchase Book'
                    className='dropdown-item'
                  />
                  <Link
                    to='/dashboard/sale'
                    children='Sale Book'
                    className='dropdown-item'
                  />
                  <Link
                    to='/dashboard/payment'
                    children='Payment Book'
                    className='dropdown-item'
                  />
                  <Link
                    to='/dashboard/recovery'
                    children='Recovery Book'
                    className='dropdown-item'
                  />
                </div>
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-outline-primary my-2 my-sm-0"
              onClick={() => this.props.signOut()}
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(actions.signOut())
  }
}

export default connect(null, mapDispatchToProps)(Header);