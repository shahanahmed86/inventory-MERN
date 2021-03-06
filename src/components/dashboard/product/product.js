import React, { Component } from 'react';
import { Paper, TextField, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

import channel from '../../../config';
import Search from './search';
import actions from '../../../store/actions';

class Product extends Component {
	constructor() {
		super();
		this.state = {
			_id: '',
			productName: '',
			manufacturer: '',
			description: '',
			editing: false,
			isPopup: false,
			isSearch: false
		};
	}
	componentDidMount = () => {
		channel.bind('products', () => {
			this.props.getProduct();
		});
	};
	componentWillUpdate = () => {
		if (this.props.store.partialLoader) return this.onClearHandler();
	};
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	getRow = (id) => {
		const obj = this.props.store.products.find((val) => val._id === id);
		const { _id, productName, manufacturer, description } = obj;
		this.setState({
			_id,
			productName,
			manufacturer,
			description,
			editing: true,
			isPopup: false,
			isSearch: false
		});
	};
	onSaveHandler = () => {
		const { _id, productName, manufacturer, description, editing } = this.state;
		if (!editing) return this.props.productSave({ productName, manufacturer, description });
		return this.props.updateProduct({ _id, productName, manufacturer, description });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			isSearch: !state.isSearch
		}));
	};
	onClearHandler = () => {
		this.setState({
			_id: '',
			productName: '',
			manufacturer: '',
			description: '',
			editing: false,
			isSearch: false,
			isPopup: false
		});
	};
	validateSearch = (ev) => {
		if (ev.keyCode === 13) return this.setState({ isPopup: true });
		if (ev.keyCode === 27) return this.setState({ isPopup: false });
	};
	render() {
		const { partialLoader } = this.props.store;
		if (partialLoader) {
			return (
				<div className="partial-loader-container">
					<CircularProgress color="primary" />
				</div>
			);
		}
		const { productName, manufacturer, description } = this.state;
		return (
			<div>
				<Paper elevation={24} className="the-form">
					<Typography
						children="Product Form"
						align="center"
						color="secondary"
						gutterBottom={true}
						variant="h5"
					/>
					<TextField
						autoFocus
						type="text"
						margin="dense"
						label="Product Name"
						name="productName"
						value={productName}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<TextField
						type="text"
						margin="dense"
						label="Manufacturer"
						name="manufacturer"
						value={manufacturer}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<TextField
						type="text"
						margin="dense"
						label="Description"
						name="description"
						value={description}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<div className="buttons-group">
						<div className="btn-group" role="group" aria-label="Basic example">
							<button
								className={this.state.editing ? 'btn btn-secondary' : 'btn btn-primary'}
								onClick={this.onSaveHandler}
							>
								{this.state.editing ? 'Update' : 'Save'}
							</button>
							<button className="btn btn-success" onClick={this.onBrowseHandler}>
								Browse
							</button>
							<button className="btn btn-danger" onClick={this.onClearHandler}>
								Clear
							</button>
						</div>
					</div>
					{this.state.isSearch && (
						<Search
							getRow={this.getRow}
							isPopup={this.state.isPopup}
							validateSearch={this.validateSearch}
							deleteProduct={this.props.deleteProduct}
						/>
					)}
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

const mapDispatchToProps = (dispatch) => {
	return {
		productSave: (data) => dispatch(actions.productSave(data)),
		updateProduct: (data) => dispatch(actions.updateProduct(data)),
		getProduct: () => dispatch(actions.getProduct()),
		deleteProduct: (id) => dispatch(actions.deleteProduct(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
