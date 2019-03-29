import React, { Component } from 'react';
import { Paper, TextField, Typography } from '@material-ui/core';
import { connect } from 'react-redux';

import Search from './search';
import actions from '../../../store/actions';

class Vendor extends Component {
	constructor() {
		super();
		this.state = {
			_id: '',
			vendorName: '',
			address: '',
			telephone: '',
			email: '',
			ntn: '',
			editing: false,
			isSearch: false,
			isPopup: false
		};
	}
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	getRow = (id) => {
		const obj = this.props.store.vendors.find((val) => val._id === id);
		const { _id, vendorName, address, telephone, email, ntn } = obj;
		this.setState({
			editing: true,
			_id,
			vendorName,
			address,
			telephone,
			email,
			ntn,
			isSearch: false,
			isPopup: false
		});
	};
	onSaveHandler = () => {
		const { _id, vendorName, address, telephone, email, ntn, editing } = this.state;
		if (!editing) return this.props.vendorSave({ vendorName, address, telephone, email, ntn });
		return this.props.updateVendor({ _id, vendorName, address, telephone, email, ntn });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			isSearch: !state.isSearch
		}));
	};
	onClearHandler = () => {
		this.setState({
			_id: '',
			vendorName: '',
			address: '',
			telephone: '',
			email: '',
			ntn: '',
            editing: false,
            isSearch: false,
            isPopup: false
		});
    };
    onCloseSearch = () => {
		setTimeout(() => {
			this.setState({
				isPopup: false
			});
		}, 1500);
	};
	validateSearch = () => {
		this.props.getVendor();
		this.setState({
			isPopup: true
		});
	};
	render() {
		const { vendorName, address, telephone, email, ntn } = this.state;
		return (
			<div>
				<Paper elevation={24} className="the-form">
					<Typography
						children="Vendor Form"
						align="center"
						color="secondary"
						gutterBottom={true}
						variant="h5"
					/>
					<TextField
						type="text"
						margin="dense"
						label="Vendor Name"
						name="vendorName"
						value={vendorName}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<TextField
						type="text"
						margin="dense"
						label="Address"
						name="address"
						value={address}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<TextField
						type="text"
						margin="dense"
						label="Telephone"
						name="telephone"
						value={telephone}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<TextField
						type="text"
						margin="dense"
						label="Email Address"
						name="email"
						value={email}
						onChange={this.handleChange}
						variant="filled"
						fullWidth={true}
					/>
					<TextField
						type="text"
						margin="dense"
						label="National Tax Number"
						name="ntn"
						value={ntn}
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
							onCloseSearch={this.onCloseSearch}
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
		vendorSave: (data) => dispatch(actions.vendorSave(data)),
		updateVendor: (data) => dispatch(actions.updateVendor(data)),
		getVendor: () => dispatch(actions.getVendor())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
