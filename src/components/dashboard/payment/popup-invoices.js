import React, { Component } from 'react';
import { Paper, TextField } from '@material-ui/core';
import { connect } from 'react-redux';

class PopupInvoices extends Component {
	renderSearchBlockProduct = () => {
		const { invoice, vendorId, getInvoiceField, editing, store } = this.props;
		const search = invoice.toLowerCase();
		const allBills = store.purchases.filter((val) => val.invoice.toLowerCase().indexOf(search) !== -1);
		const payments = store.payments.filter((x) => x.vendorId._id === vendorId);
		const getBills = {};
		for (let key in allBills) {
			getBills[allBills[key].invoice] = {
				billed: allBills[key].products.reduce((acc, cur) => acc + +cur.value, 0),
				paid: 0
			};
			payments.forEach((x) => {
				x.details.forEach((y) => {
					console.log(allBills[key].invoice, y.invoice);
					if (allBills[key].invoice === y.invoice) {
						getBills[allBills[key].invoice].paid += +y.pay;
					}
				});
			});
		}
		console.log(getBills);
		let bills = [];
		const realized = { bill: 0, pay: 0 };
		payments.forEach((x) => {
			x.details.forEach((y) => {
				if (y.invoice.toLowerCase().indexOf(search) !== -1) {
					realized.pay += +y.pay;
				}
			});
		});
		if (!editing) {
			allBills.forEach((z) => {
				if (z.invoice.toLowerCase().indexOf(search) !== -1) {
					realized.bill = z.products.reduce((acc, cur) => acc + cur.value, 0);
					if (realized.bill > realized.pay) {
						bills.push(z);
					} else {
						bills = allBills;
					}
				}
			});
		} else {
			bills = allBills;
		}
		return (
			<Paper elevation={24} className="popout-block">
				{bills.length ? (
					bills.map((val, ind) => {
						return (
							<ul className="list-group" key={ind}>
								<li className="list-group-item">
									<button className="btn btn-secondary" onClick={() => getInvoiceField(val)}>
										{val.invoice}
									</button>
								</li>
								<li className="list-group-item">Date: {val.date.slice(0, 10)}</li>
								<li className="list-group-item">
									Amount: {val.products.reduce((acc, cur) => acc + +cur.value, 0).toLocaleString()}/-
								</li>
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
		const { invoice, ind, detail, handleChangeTab, validateInvoice, vendorList } = this.props;
		return (
			<div>
				<TextField
					type="text"
					variant="standard"
					name="invoice"
					value={invoice}
					onChange={(ev) => handleChangeTab(ev, ind)}
					onKeyDown={(ev) => validateInvoice(ev, ind)}
				/>
				{!vendorList && detail.detailList && this.renderSearchBlockProduct()}
			</div>
		);
	}
}

const mapStateToProps = (store) => {
	return { store };
};

export default connect(mapStateToProps, null)(PopupInvoices);
