import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './dashboard/header';

class Dashboard extends Component {
    componentDidMount() {
        if (this.props.store.profile.email) return this.props.history.push('/dashboard');
        return this.props.history.push('/');
    }
    render() {
        return (
            <div className='container'>
                <Header />
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { store }
};

export default connect(mapStateToProps, null)(Dashboard);