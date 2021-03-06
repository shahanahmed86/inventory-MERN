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
	renderSearchBlock = () => {
		const { getPaymentFields, onDelete, store } = this.props;
		const search = this.state.search.toLowerCase();
		const payments = store.payments.filter((val) => val.refNo.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{payments.length ? (
					payments.map((val, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<Fab
										size="small"
										color="primary"
										aria-label="Edit"
										onClick={() => getPaymentFields(val._id)}
									>
										<Icon>edit_icon</Icon>
									</Fab>
									<Fab
										size="small"
										color="secondary"
										aria-label="Delete"
										onClick={() => onDelete(val._id)}
									>
										<DeleteIcon />
									</Fab>
								</li>
								<li className="list-group-item">Date: {val.date.slice(0, 10)}</li>
								<li className="list-group-item">Reference: {val.refNo}</li>
								<li className="list-group-item">Vendor: {val.vendorId.vendorName}</li>
							</ul>
						);
					})
				) : (
					<h4 className="simple-flex">Empty</h4>
				)}
			</Paper>
		);
	};
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	render() {
		const { options, getEntry, validateSearch } = this.props;
		const { search } = this.state;
		return (
			<div className="simple-flex">
				<div>
					<div>
						<TextField
							autoFocus
							type="text"
							margin="dense"
							variant="standard"
							label="Type reference #"
							name="search"
							value={search}
							onChange={this.handleChange}
							onKeyDown={validateSearch}
						/>
					</div>
					<div>{options && getEntry && this.renderSearchBlock()}</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(Search);