import React, { Component } from 'react';

class Header extends Component {
    render() {
        return (
            <div className='container'>
                <nav className="navbar navbar-expand-md navbar-light bg-light rounded">
                    <a className="navbar-brand" href='http://google.com'>Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarsExample09">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <a className="nav-link" href='http://google.com'>Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href='http://google.com'>Link</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href='http://google.com'>Disabled</a>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="https://example.com" id="dropdown09" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                                <div className="dropdown-menu" aria-labelledby="dropdown09">
                                    <a className="dropdown-item" href='http://google.com'>Action</a>
                                    <a className="dropdown-item" href='http://google.com'>Another action</a>
                                    <a className="dropdown-item" href='http://google.com'>Something else here</a>
                                </div>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-md-0">
                            <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
                        </form>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Header;