import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import { connect } from 'react-redux';

class PopupProduct extends Component {
	render() {
		const { row, ind, handleChangeTab, validateProduct, onCloseProductList, vendorList } = this.props;
		return (
			<div>
				<TextField
					type="text"
					variant="standard"
					name="productName"
					value={row.productName}
					onChange={(ev) => handleChangeTab(ev, ind)}
					onFocus={() => validateProduct(ind)}
					onBlur={() => onCloseProductList(ind)}
				/>
				{!vendorList && row.productList && this.renderSearchBlockProduct()}
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(PopupProduct);
