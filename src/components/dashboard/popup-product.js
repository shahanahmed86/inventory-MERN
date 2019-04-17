import React, { Component } from 'react';
import { Paper, TextField } from '@material-ui/core';
import { connect } from 'react-redux';

class PopupProduct extends Component {
	renderSearchBlockProduct = () => {
		const { productName, getProductFields, store } = this.props;
		const search = productName.toLowerCase();
		const products = store.products.filter((val) => val.productName.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{products.length ? (
					products.map((val, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<button
										className="btn btn-secondary"
										onClick={() => getProductFields(val._id, val.productName)}
									>
										{val.productName}
									</button>
								</li>
								<li className="list-group-item">Manufacturer: {val.manufacturer}</li>
								<li className="list-group-item">Description: {val.description}</li>
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
		const { productName, ind, inputProducts, handleChangeTab, validateProduct, vendorList } = this.props;
		return (
			<div>
				<TextField
					type="text"
					variant="standard"
					name="productName"
					value={productName}
					onChange={(ev) => handleChangeTab(ev, ind)}
					onKeyDown={(ev) => validateProduct(ev, ind)}
				/>
				{!vendorList && inputProducts[ind].productList && this.renderSearchBlockProduct()}
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(PopupProduct);
