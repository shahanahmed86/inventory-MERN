import React, { Component } from 'react';
import {
	withStyles,
	Paper,
	Typography,
	TextField,
	Fab,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableFooter,
	TableCell,
	FormControl,
	Select
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';

import channel from '../../../config';
import Search from './search';
import PopupVendor from '../popup-vendor';
import actions from '../../../store/actions';
import PopupInvoices from './popup-invoices';

const CustomTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		textAlign: 'center',
		padding: 5
	},
	body: {
		fontSize: 13,
		padding: 5
	},
	footer: {
		fontSize: 16,
		padding: 5
	}
}))(TableCell);

const styles = (theme) => ({
	root: {
		width: '100%',
		padding: 5,
		marginTop: theme.spacing.unit,
		overflowX: 'auto'
	},
	table: {
		minWidth: 'fit-content'
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		}
	},
	fab: {
		margin: theme.spacing.unit
	},
	formControl: {
		minWidth: 200
	},
	selectControl: {
		minWidth: 100
	}
});

class Payment extends Component {
	constructor() {
		super();
		this.state = {
			editing: false,
			_id: '',
			date: '',
			refNo: '',
			vendorId: '',
			vendorName: '',
			vendorList: false,
			details: [
				{
					invoice: '',
					balance: '0',
					pay: '0',
					head: 'Cash',
					description: '',
					detailList: false
				}
			],
			search: '',
			options: false,
			getEntry: false
		};
	}
	componentDidMount() {
		channel.bind('payments', () => {
			this.props.getPayment();
		});
		channel.bind('purchases', () => {
			this.props.getPurchase();
		});
		channel.bind('vendors', () => {
			this.props.getVendor();
		});
		this.getRefNo();
	}
	getRefNo() {
		if (!this.props.store.payments.length) return this.setState({ refNo: 1 });
		return this.setState({ refNo: this.props.store.payments.length + 1 });
	}
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	handleChangeTab = (ev, ind) => {
		const { name, value } = ev.target;
		const details = [ ...this.state.details ];
		details[ind][name] = value;
		this.setState({ details });
	};
	onSaveHandler = () => {
		const { _id, date, refNo, vendorId, details, editing } = this.state;
		if (!editing) return this.props.paymentSave({ date, refNo, vendorId, details });
		return this.props.updatePayment({ _id, date, refNo, vendorId, details });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			options: !state.options
		}));
	};
	onClearHandler = () => {
		this.setState({
			editing: false,
			_id: '',
			date: '',
			refNo: '',
			vendorId: '',
			vendorName: '',
			vendorList: false,
			details: [
				{
					invoice: '',
					balance: '0',
					pay: '0',
					head: 'Cash',
					description: '',
					detailList: false
				}
			],
			search: '',
			options: false,
			getEntry: false
		});
	};
	onAddRow = () => {
		const details = [ ...this.state.details ];
		const isFilled = [];
		details.forEach((x) => {
			isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
		});
		if (isFilled.every((val) => Boolean(val))) {
			details.push({
				invoice: '',
				balance: '0',
				pay: '0',
				head: 'Cash',
				description: '',
				detailList: false
			});
			return this.setState({ details });
		}
		return this.props.onSnackHandler(true, 'Please fill previous row first');
	};
	onRemoveRow = (ind) => {
		const details = [ ...this.state.details ];
		if (details.length > 1) {
			details[ind].detailList = false;
			details.splice(ind, 1);
			this.setState({ details });
		} else {
			this.setState({
				details: [
					{
						invoice: '',
						balance: '0',
						pay: '0',
						head: 'Cash',
						description: '',
						detailList: false
					}
				]
			});
		}
	};
	validateSearch = (ev) => {
		if (ev.keyCode === 13) return this.setState({ getEntry: true });
		if (ev.keyCode === 27) return this.setState({ getEntry: false });
	};
	validateVendor = (ev) => {
		if (ev.keyCode === 13) return this.setState({ vendorList: true });
		if (ev.keyCode === 27) return this.setState({ vendorList: false });
	};
	getVendorFields = (vendorId, vendorName) => {
		this.setState({
			vendorId,
			vendorName,
			vendorList: false,
			details: [
				{
					invoice: '',
					balance: '0',
					pay: '0',
					head: 'Cash',
					description: '',
					detailList: false
				}
			]
		});
	};
	validateInvoice = (ev, ind) => {
		const details = [ ...this.state.details ];
		if (ev.keyCode === 13) details[ind].detailList = true;
		if (ev.keyCode === 27) details[ind].detailList = false;
		this.setState({ ind, details });
	};
	getInvoiceField = (value) => {
		const details = [ ...this.state.details ];
		const ind = this.state.ind;
		const count = { cash: 0, notCash: 0 };
		details[ind].invoice = value.invoice;
		details.forEach((val) => {
			if (val.invoice === value.invoice) {
				if (val.head === 'Cash') {
					count.cash++;
				} else if (val.head === 'Not Cash') {
					count.notCash++;
				} else {
				}
			}
		});
		if (count.cash > 1) return this.props.onSnackHandler(true, "can't enter same product");
		if (count.notCash > 1) return this.props.onSnackHandler(true, "can't enter same product");
		details[ind].purchaseId = value._id;
		const amounts = this.getBalance(value);
		details[ind].balance = +amounts.invoiceValue - +amounts.realized;
		details[ind].detailList = false;
		this.setState({ details });
	};
	getBalance = (value) => {
		const payments = this.props.store.payments;
		const amounts = { invoiceValue: 0, realized: [] };
		amounts.invoiceValue = value.products.reduce((acc, cur) => acc + +cur.value, 0);
		payments.forEach((x) => {
			x.details.forEach((y) => {
				if (y.invoice === value.invoice) {
					amounts.realized.push(y);
				}
			});
		});
		amounts.realized = amounts.realized.reduce((acc, cur) => acc + +cur.pay, 0);
		return amounts;
	};
	getPaymentFields = (id) => {
		const payment = this.props.store.payments.find((val) => val._id === id);
		const { _id, date, refNo, vendorId, details } = payment;
		this.setState({
			_id,
			date: date.slice(0, 10),
			refNo,
			oldVendorId: vendorId._id,
			vendorId: vendorId._id,
			vendorName: vendorId.vendorName,
			details: details.map((val) => {
				const { purchaseId, invoice, pay, head, description } = val;
				const value = this.props.store.purchases.find((x) => x.invoice === invoice);
				const amounts = this.getBalance(value);
				return {
					purchaseId: purchaseId._id,
					invoice,
					balance: +amounts.invoiceValue - +amounts.realized + +pay,
					pay,
					head,
					description,
					oldPurchaseId: purchaseId._id,
					oldPay: pay,
					detailList: false
				};
			}),
			editing: true,
			getEntry: false,
			options: false
		});
	};
	render() {
		const { date, refNo, vendorName, details, editing } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<Paper elevation={24} className="pb-form">
					<Typography
						children="Payment Form"
						align="center"
						color="secondary"
						gutterBottom={true}
						variant="h5"
					/>
					<TextField
						autoFocus
						type="date"
						margin="dense"
						InputLabelProps={{ shrink: true }}
						label="Date"
						variant="standard"
						name="date"
						value={date}
						onChange={this.handleChange}
					/>
					<br />
					<TextField
						disabled={true}
						type="text"
						margin="dense"
						label="Ref #"
						variant="standard"
						name="refNo"
						value={refNo}
						onChange={this.handleChange}
					/>
					<br />
					<PopupVendor
						vendorName={vendorName}
						handleChange={this.handleChange}
						validateVendor={this.validateVendor}
						vendorList={this.state.vendorList}
						getVendorFields={this.getVendorFields}
					/>
					<div className="row">
						<div className="col-xs-12">
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell>Invoice</CustomTableCell>
										<CustomTableCell>Balance</CustomTableCell>
										<CustomTableCell>Amount</CustomTableCell>
										<CustomTableCell>Paid</CustomTableCell>
										<CustomTableCell>Description</CustomTableCell>
										<CustomTableCell
											style={{
												padding: 3
											}}
										>
											x
										</CustomTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{details.map((row, ind) => (
										<TableRow className={classes.row} key={ind}>
											<CustomTableCell>
												<PopupInvoices
													invoice={row.invoice}
													vendorId={this.state.vendorId}
													ind={ind}
													detail={row}
													vendorList={this.state.vendorList}
													handleChangeTab={(ev) => this.handleChangeTab(ev, ind)}
													validateInvoice={(ev) => this.validateInvoice(ev, ind)}
													getInvoiceField={this.getInvoiceField}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													disabled={true}
													type="text"
													variant="standard"
													name="balance"
													value={row.balance}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="pay"
													value={row.pay}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<FormControl>
													<Select
														native
														autoWidth
														displayEmpty
														variant="standard"
														name="head"
														value={row.head}
														onChange={(ev) => this.handleChangeTab(ev, ind)}
														className={classes.selectControl}
													>
														<option value="Cash">Cash</option>
														<option value="Not Cash">Not Cash</option>
													</Select>
												</FormControl>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="description"
													value={row.description}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell
												style={{
													padding: 3
												}}
											>
												<Fab
													size="small"
													color="secondary"
													aria-label="Delete"
													className={classes.fab}
													onClick={() => this.onRemoveRow(ind)}
												>
													<DeleteIcon />
												</Fab>
											</CustomTableCell>
										</TableRow>
									))}
								</TableBody>
								<TableFooter>
									<TableRow className={classes.row}>
										<CustomTableCell>Total</CustomTableCell>
										<CustomTableCell />
										<CustomTableCell>
											{details
												.reduce((sum, val) => parseInt(sum) + parseInt(val.pay), 0)
												.toLocaleString()}
										</CustomTableCell>
										<CustomTableCell />
										<CustomTableCell />
									</TableRow>
								</TableFooter>
							</Table>
						</div>
					</div>
					<Fab size="small" color="primary" aria-label="Add" onClick={this.onAddRow}>
						<AddIcon />
					</Fab>
					<div className="buttons-group">
						<div className="btn-group" role="group" aria-label="Basic example">
							<button
								className={editing ? 'btn btn-secondary' : 'btn btn-primary'}
								onClick={this.onSaveHandler}
							>
								{editing ? 'Update' : 'Save'}
							</button>
							<button className="btn btn-success" onClick={this.onBrowseHandler}>
								Browse
							</button>
							<button className="btn btn-danger" onClick={this.onClearHandler}>
								Clear
							</button>
						</div>
					</div>
					{this.state.options && (
						<Search
							options={this.state.options}
							getEntry={this.state.getEntry}
							validateSearch={this.validateSearch}
							getPaymentFields={this.getPaymentFields}
							onDelete={this.props.deletePayment}
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
		onSnackHandler: (snack, message) => dispatch(actions.onSnackHandler({ snack, message })),
		getVendor: () => dispatch(actions.getVendor()),
		getPurchase: () => dispatch(actions.getPurchase()),
		paymentSave: (data) => dispatch(actions.paymentSave(data)),
		getPayment: () => dispatch(actions.getPayment()),
		updatePayment: (data) => dispatch(actions.updatePayment(data)),
		deletePayment: (id) => dispatch(actions.deletePayment(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Payment));
