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
		const { getSaleFields, onDelete, store } = this.props;
		const search = this.state.search.toLowerCase();
		const sales = store.sales.filter((val) => val.invoice.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{sales.length ? (
					sales.map((val, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<Fab
										size="small"
										color="primary"
										aria-label="Edit"
										onClick={() => getSaleFields(val._id)}
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
								<li className="list-group-item">Invoice: {val.invoice}</li>
								<li className="list-group-item">Client: {val.clientId.clientName}</li>
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
		const { options, getSal, validateSearch, onCloseSearch } = this.props;
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
							label="Type Invoice #"
							name="search"
							value={search}
							onChange={this.handleChange}
							onFocus={validateSearch}
							onBlur={onCloseSearch}
						/>
					</div>
					<div>{options && getSal && this.renderSearchBlock()}</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(Search);