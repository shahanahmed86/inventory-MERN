import React, { Component } from 'react';
import { connect } from 'react-redux';

import actions from '../store/actions';

class Dashboard extends Component {
    componentDidMount() {
        this.props.isLoggedIn(document.cookie);
        if (document.cookie) return this.props.history.push('/dashboard');
        return this.props.history.push('/');
    }
    render() {
        return (
            <div>
                Dashboard                
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { store }
};

const mapDispatchToProps = dispatch => {
    return {
        isLoggedIn: data => dispatch(actions.isLoggedIn(data)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);