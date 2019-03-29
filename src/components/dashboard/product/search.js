import React, { Component } from 'react';
import { TextField, Paper, Fab, Icon } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import actions from '../../../store/actions';

class Search extends Component {
	constructor() {
		super();
		this.state = {
			search: '',
		};
	}
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	renderSearchBlock = () => {
		const { getRow, store } = this.props;
		const search = this.state.search.toLowerCase();
		const products = store.products.filter((val) => val.productName.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{products.length ? (
					products.map((row, ind) => {
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
										onClick={() => this.props.deleteClient(row._id)}
									>
										<DeleteIcon />
									</Fab>
								</li>
								<li className="list-group-item">Product: {row.productName}</li>
								<li className="list-group-item">Manufacturer: {row.manufacterer}</li>
								<li className="list-group-item">Description: {row.description}</li>
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
		const { isPopup, validateSearch, onCloseSearch } = this.props;
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
							onFocus={validateSearch}
							onBlur={onCloseSearch}
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

const mapDispatchToProps = (dispatch) => {
	return {
		onDialog: (data) => dispatch(actions.onDialog(data)),
		deleteProduct: (id) => dispatch(actions.deleteProduct(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
