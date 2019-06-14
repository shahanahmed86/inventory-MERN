import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import Header from './header';
import Product from './dashboard/product/product';
import Vendor from './dashboard/vendor/vendor';
import Client from './dashboard/client/client';
import Purchase from './dashboard/purchase/purchase';
import Sale from './dashboard/sale/sale';
import Payment from './dashboard/payment/payment';
import Recovery from './dashboard/recovery/recovery';
import actions from '../store/actions';

const routes = [
	{
		path: '/dashboard/product',
		exact: true,
		main: (props) => <Product {...props} />
	},
	{
		path: '/dashboard/vendor',
		exact: true,
		main: (props) => <Vendor {...props} />
	},
	{
		path: '/dashboard/client',
		exact: true,
		main: (props) => <Client {...props} />
	},
	{
		path: '/dashboard/purchase',
		exact: true,
		main: (props) => <Purchase {...props} />
	},
	{
		path: '/dashboard/sale',
		exact: true,
		main: (props) => <Sale {...props} />
	},
	{
		path: '/dashboard/payment',
		exact: true,
		main: (props) => <Payment {...props} />
	},
	{
		path: '/dashboard/recovery',
		exact: true,
		main: (props) => <Recovery {...props} />
	}
];

class Dashboard extends Component {
	componentDidMount() {
		if (!this.props.store.profile.email) return this.props.history.push('/');
		this.props.getClient();
		this.props.getPayment();
		this.props.getRecovery();
		this.props.getProduct();
		this.props.getPurchase();
		this.props.getSale();
		this.props.getVendor();
	}
	render() {
		return (
			<div>
				<header>
					<Header />
				</header>
				<section className="container">
					{routes.map((val, ind) => {
						return <Route key={ind} path={val.path} exact={val.exact} component={val.main} />;
					})}
				</section>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

const mapDispatchToProps = (dispatch) => {
	return {
		getClient: () => dispatch(actions.getClient()),
		getPayment: () => dispatch(actions.getPayment()),
		getRecovery: () => dispatch(actions.getRecovery()),
		getProduct: () => dispatch(actions.getProduct()),
		getPurchase: () => dispatch(actions.getPurchase()),
		getSale: () => dispatch(actions.getSale()),
		getVendor: () => dispatch(actions.getVendor())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
