import React, { Component } from 'react';
import { TextField, Paper, Fab, Icon } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';

class Search extends Component {
	constructor() {
		super();
		this.state = {
			search: ''
		};
	}
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	renderSearchBlock = () => {
		const { getRow, store, deleteClient } = this.props;
		const search = this.state.search.toLowerCase();
		const clients = store.clients.filter((val) => val.clientName.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{clients.length ? (
					clients.map((row, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<Fab size="small" color="primary" aria-label="Edit" onClick={() => getRow(row._id)}>
										<Icon>edit_icon</Icon>
									</Fab>
									<Fab
										size="small"
										color="secondary"
										aria-label="Delete"
										onClick={() => deleteClient(row._id)}
									>
										<DeleteIcon />
									</Fab>
								</li>
								<li className="list-group-item">Client: {row.clientName}</li>
								<li className="list-group-item">Address: {row.address}</li>
								<li className="list-group-item">Telephone: {row.telephone}</li>
								<li className="list-group-item">Email: {row.email}</li>
								<li className="list-group-item">NTN: {row.ntn}</li>
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
		const { search } = this.state;
		const { isPopup, validateSearch } = this.props;
		return (
			<div className="simple-flex">
				<div>
					<div>
						<TextField
							autoFocus
							type="text"
							margin="dense"
							variant="standard"
							label="Type Client Name..."
							name="search"
							value={search}
							onChange={this.handleChange}
							onKeyDown={validateSearch}
						/>
					</div>
					<div>{isPopup && this.renderSearchBlock()}</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(Search);
