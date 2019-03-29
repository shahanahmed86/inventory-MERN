import React, { Component } from 'react';
import { TextField, Paper } from '@material-ui/core';
import { connect } from 'react-redux';

class PopupClient extends Component {
	renderSearchBlockClient = () => {
		const { clientName, store, getClientFields } = this.props;
		const search = clientName.toLowerCase();
		const clients = store.clients.filter((val) => val.clientName.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{clients.length ? (
					clients.map((val, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<button
										className="btn btn-secondary"
										onClick={() => getClientFields(val._id, val.clientName)}
									>
										{val.clientName}
									</button>
								</li>
								<li className="list-group-item">Address: {val.address}</li>
								<li className="list-group-item">Telephone: {val.telephone}</li>
								<li className="list-group-item">Email: {val.email}</li>
								<li className="list-group-item">NTN: {val.ntn}</li>
							</ul>
						);
					})
				) : (
					<h4 className="simple-flex">Empty</h4>
				)}
			</Paper>
		);
	};
	render() {
		const { clientName, validateClient, clientList, handleChange, onCloseClientList } = this.props;
		return (
			<div>
				<TextField
					type="text"
					margin="dense"
					variant="standard"
					label="Client"
					name="clientName"
					value={clientName}
					onChange={handleChange}
					onFocus={validateClient}
					onBlur={onCloseClientList}
				/>
				{clientList && this.renderSearchBlockClient()}
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(PopupClient);
