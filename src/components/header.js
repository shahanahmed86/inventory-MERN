import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
                    children='Products'
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
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;