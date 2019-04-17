import React, { Component } from 'react';
import { TextField, Paper } from '@material-ui/core';
import { connect } from 'react-redux';

class PopupVendor extends Component {
	renderSearchBlockVendor = () => {
		const { vendorName, store, getVendorFields } = this.props;
		const search = vendorName.toLowerCase();
		const vendors = store.vendors.filter((val) => val.vendorName.toLowerCase().indexOf(search) !== -1);
		return (
			<Paper elevation={24} className="popout-block">
				{vendors.length ? (
					vendors.map((val, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<button
										className="btn btn-secondary"
										onClick={() => getVendorFields(val._id, val.vendorName)}
									>
										{val.vendorName}
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
		const { vendorName, validateVendor, vendorList, handleChange } = this.props;
		return (
			<div>
				<TextField
					type="text"
					margin="dense"
					variant="standard"
					label="Vendor"
					name="vendorName"
					value={vendorName}
					onChange={handleChange}
					onKeyDown={validateVendor}
				/>
				{vendorList && this.renderSearchBlockVendor()}
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(PopupVendor);
