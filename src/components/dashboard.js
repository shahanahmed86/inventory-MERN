import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import Header from './header';
import Product from './dashboard/product/product';

const routes = [
    {
        path: '/dashboard/product',
        exact: true,
        main: props => <Product {...props} />
    },
];

class Dashboard extends Component {
    componentDidMount() {
        if (!this.props.store.profile.email) return this.props.history.push('/');
    }
    render() {
        return (
            <div>
                <header>
                    <Header />
                </header>
                <section className='container'>
                    {routes.map((val, ind) => {
                        return (
                            <Route
                                key={ind}
                                path={val.path}
                                exact={val.exact}
                                component={val.main}
                            />
                        );
                    })}
                </section>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { store }
};

export default connect(mapStateToProps, null)(Dashboard);