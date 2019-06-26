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
	TableCell
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

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

const getNowDate = () => {
	const x = new Date();
	let date = '2019-';
	date += x.getMonth() < 9 ? '0' + (x.getMonth() + 1) + '-' : x.getMonth() + '-';
	date += x.getDate() < 10 ? '0' + (x.getDate() + 1) : x.getDate();
	return date;
};

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
					description: '',
					detailList: false
				}
			],
			search: '',
			options: false,
			getEntry: false
		};
	}
	componentDidMount = () => {
		this.getRefNo();
		channel.bind('payments', () => {
			this.props.getPayment();
		});
		channel.bind('purchases', () => {
			this.props.getPurchase();
		});
		channel.bind('vendors', () => {
			this.props.getVendor();
		});
	};
	static getDerivedStateFromProps = (nextProps, prevState) => {
		const { payments } = nextProps.store;
		const date = getNowDate();
		if ((payments.length && !prevState.editing) || nextProps.store.partialLoader) {
			const arr = [];
			for (let key in payments) {
				arr.push(payments[key].refNo);
			}
			const refNo = Math.max(...arr) + 1;
			if (refNo !== prevState.refNo) return {
				refNo, date,
				vendorId: '',
				vendorName: '',
				vendorList: false,
				details: [
					{
						invoice: '',
						balance: '0',
						pay: '0',
						description: '',
						detailList: false
					}
				],
				search: '',
				options: false,
				getEntry: false				
			};
			return null;
		}
		return null;
	};
	getRefNo = () => {
		const { payments } = this.props.store;
		const date = getNowDate();
		if (payments.length) {
			const arr = [];
			for (let key in payments) {
				arr.push(payments[key].refNo);
			}
			const refNo = Math.max(...arr) + 1;
			return this.setState({ refNo, date });
		}
		return this.setState({ refNo: 1, date });
	};
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
		if (!editing) {
			this.props.paymentSave({ date, refNo, vendorId, details });
		} else {
			this.props.updatePayment({ _id, date, refNo, vendorId, details });
		}
		this.getRefNo();
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
					description: '',
					detailList: false
				}
			],
			search: '',
			options: false,
			getEntry: false
		});
		this.getRefNo();
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
			for (let i = 0; i < details.length; i++) {
				details[i].detailList = false;
			}
			details.splice(ind, 1);
			this.setState({ details });
		} else {
			this.setState({
				details: [
					{
						invoice: '',
						balance: '0',
						pay: '0',
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
		const count = { record: 0 };
		details[ind].invoice = value.invoice;
		details.forEach((val) => {
			if (val.invoice === value.invoice) {
				count.record++;
			}
		});
		if (count.record > 1) return this.props.onSnackHandler(true, "can't enter same product");
		details[ind].purchaseId = value._id;
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
		if (id) {
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
					const { purchaseId, invoice, pay, description } = val;
					const value = this.props.store.purchases.find((x) => x.invoice === invoice);
					const amounts = this.getBalance(value);
					return {
						purchaseId,
						invoice,
						balance: +amounts.invoiceValue - +amounts.realized + +pay,
						pay,
						description,
						detailList: false
					};
				}),
				editing: true,
				getEntry: false,
				options: false
			});
		}
	};
	validatePayment = (ind) => {
		const details = [ ...this.state.details ];
		if (!this.state.editing) {
			if (details[ind].purchaseId) {
				const search = details[ind].invoice;
				const value = this.props.store.purchases.find((x) => x.invoice === search);
				const amounts = this.getBalance(value);
				details[ind].balance = +amounts.invoiceValue - +amounts.realized;
			}
		} else {
			const search = details[ind].invoice;
			const value = this.props.store.purchases.find((x) => x.invoice === search);
			const amounts = this.getBalance(value);
			const oldDetails = this.props.store.payments
				.find((x) => x.refNo === this.state.refNo)
				.details.find((x) => x.invoice === value.invoice);
			if (oldDetails) {
				if (oldDetails.purchaseId === details[ind].purchaseId) {
					details[ind].pay = oldDetails.pay;
					details[ind].balance = +amounts.invoiceValue - +amounts.realized + +oldDetails.pay;
				} else {
					details[ind].balance = +amounts.invoiceValue - +amounts.realized;
				}
			} else {
				details[ind].balance = +amounts.invoiceValue - +amounts.realized;
			}
		}
		this.setState({ details });
	};
	balanceCheck = (ind) => {
		const details = [ ...this.state.details ];
		if (details[ind].pay > details[ind].balance) {
			details[ind].balanceDesc = `Balance will be negative by ${details[ind].balance - details[ind].pay}`;
		} else {
			details[ind].balanceDesc = false;
		}
		this.setState({ details });
	};
	render() {
		const { partialLoader } = this.props.store;
		if (partialLoader) {
			return (
				<div className="partial-loader-container">
					<CircularProgress color="primary" />
				</div>
			);
		}
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
													editing={editing}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													disabled={true}
													error={Boolean(row.balanceDesc)}
													helperText={row.balanceDesc && row.balanceDesc}
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
													onBlur={() => this.balanceCheck(ind)}
													onFocus={() => this.validatePayment(ind)}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
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
