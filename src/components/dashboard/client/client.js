import React, { Component } from 'react';
import { Paper, TextField, Typography } from '@material-ui/core';
import { connect } from 'react-redux';

import channel from '../../../config';
import Search from './search';
import actions from '../../../store/actions';

class Client extends Component {
	constructor() {
		super();
		this.state = {
			_id: '',
			clientName: '',
			address: '',
			telephone: '',
			email: '',
			ntn: '',
			editing: false,
			isSearch: false,
			isPopup: false
		};
	}
	componentDidMount() {
		channel.bind('clients', () => {
			this.props.getClient();
		});
	}
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	getRow = (id) => {
		const obj = this.props.store.clients.find((val) => val._id === id);
		const { _id, clientName, address, telephone, email, ntn } = obj;
		this.setState({
			editing: true,
			_id,
			clientName,
			address,
			telephone,
			email,
			ntn,
			isPopup: false,
			isSearch: false
		});
	};
	onSaveHandler = () => {
		const { _id, clientName, address, telephone, email, ntn, editing } = this.state;
		if (!editing) return this.props.clientSave({ clientName, address, telephone, email, ntn });
		return this.props.updateClient({ _id, clientName, address, telephone, email, ntn });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			isSearch: !state.isSearch
		}));
	};
	onClearHandler = () => {
		this.setState({
			_id: '',
			clientName: '',
			address: '',
			telephone: '',
			email: '',
			ntn: '',
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
		const { clientName, address, telephone, email, ntn } = this.state;
		return (
			<div>
				<Paper elevation={24} className="the-form">
					<Typography
						children="Client Form"
						align="center"
						color="secondary"
						gutterBottom={true}
						variant="h5"
					/>
					<TextField
						autoFocus
						type="text"
						margin="dense"
						label="Client Name"
						name="clientName"
						value={clientName}
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
							deleteClient={this.props.deleteClient}
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
		clientSave: (data) => dispatch(actions.clientSave(data)),
		updateClient: (data) => dispatch(actions.updateClient(data)),
		getClient: () => dispatch(actions.getClient()),
		deleteClient: (id) => dispatch(actions.deleteClient(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Client);
