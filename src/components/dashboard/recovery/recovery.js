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

import channel from '../../../config';
import Search from './search';
import PopupClient from '../popup-client';
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

class Recovery extends Component {
	constructor() {
		super();
		this.state = {
			editing: false,
			_id: '',
			date: '',
			refNo: '',
			clientId: '',
			clientName: '',
			clientList: false,
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
		channel.bind('recoveries', () => {
			this.props.getRecovery();
		});
		channel.bind('sales', () => {
			this.props.getSale();
		});
		channel.bind('clients', () => {
			this.props.getClient();
		});
	};
	static getDerivedStateFromProps = (nextProps, prevState) => {
		const { recoveries } = nextProps.store;
		if (recoveries) {
			if (recoveries.length && !prevState.editing) {
				const arr = [];
				for (let key in recoveries) {
					arr.push(recoveries[key].refNo);
				}
				const refNo = Math.max(...arr) + 1;
				if (refNo !== prevState.refNo) return { refNo };
				return null;
			}
			return null;
		}
		return null;
	};
	getRefNo = () => {
		const x = new Date();
		let date = '2019-';
		date += x.getMonth() < 9 ? '0' + (x.getMonth() + 1) + '-' : x.getMonth() + '-';
		date += x.getDate() < 10 ? '0' + (x.getDate() + 1) : x.getDate();
		const { recoveries } = this.props.store;
		if (recoveries) {
			if (recoveries.length) {
				const arr = [];
				for (let key in recoveries) {
					arr.push(recoveries[key].refNo);
				}
				const refNo = Math.max(...arr) + 1;
				return this.setState({ refNo, date });
			}
			return this.setState({ refNo: 1, date });
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
		const { _id, date, refNo, clientId, details, editing } = this.state;
		if (!editing) {
			this.props.recoverySave({ date, refNo, clientId, details });
		} else {
			this.props.updateRecovery({ _id, date, refNo, clientId, details });
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
			clientId: '',
			clientName: '',
			clientList: false,
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
	validateClient = (ev) => {
		if (ev.keyCode === 13) return this.setState({ clientList: true });
		if (ev.keyCode === 27) return this.setState({ clientList: false });
	};
	getClientFields = (clientId, clientName) => {
		this.setState({
			clientId,
			clientName,
			clientList: false,
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
		details[ind].saleId = value._id;
		details[ind].detailList = false;
		this.setState({ details });
	};
	getBalance = (value) => {
		const { recoveries } = this.props.store;
		const amounts = { invoiceValue: 0, realized: [] };
		amounts.invoiceValue = value.products.reduce((acc, cur) => acc + +cur.value, 0);
		recoveries.forEach((x) => {
			x.details.forEach((y) => {
				if (y.invoice === value.invoice) {
					amounts.realized.push(y);
				}
			});
		});
		amounts.realized = amounts.realized.reduce((acc, cur) => acc + +cur.pay, 0);
		return amounts;
	};
	getRecoveryFields = (id) => {
		if (id) {
			const recovery = this.props.store.recoveries.find((val) => val._id === id);
			const { _id, date, refNo, clientId, details } = recovery;
			this.setState({
				_id,
				date: date.slice(0, 10),
				refNo,
				oldClient: clientId._id,
				clientId: clientId._id,
				clientName: clientId.clientName,
				details: details.map((val) => {
					const { saleId, invoice, pay, description } = val;
					const value = this.props.store.sales.find((x) => x.invoice === invoice);
					const amounts = this.getBalance(value);
					return {
						saleId,
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
	validateSale = (ind) => {
		const details = [ ...this.state.details ];
		if (!this.state.editing) {
			if (details[ind].saleId) {
				const search = details[ind].invoice;
				const value = this.props.store.sales.find((x) => x.invoice === search);
				const amounts = this.getBalance(value);
				details[ind].balance = +amounts.invoiceValue - +amounts.realized;
			}
		} else {
			const search = details[ind].invoice;
			const value = this.props.store.sales.find((x) => x.invoice === search);
			const amounts = this.getBalance(value);
			const oldDetails = this.props.store.recoveries
				.find((x) => x.refNo === this.state.refNo)
				.details.find((x) => x.invoice === value.invoice);
			if (oldDetails.saleId === details[ind].saleId) {
				details[ind].pay = oldDetails.pay;
				details[ind].balance = +amounts.invoiceValue - +amounts.realized + +oldDetails.pay;
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
		const { date, refNo, clientName, details, editing } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<Paper elevation={24} className="pb-form">
					<Typography
						children="Recovery Form"
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
					<PopupClient
						clientName={clientName}
						handleChange={this.handleChange}
						validateClient={this.validateClient}
						clientList={this.state.clientList}
						getClientFields={this.getClientFields}
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
													clientId={this.state.clientId}
													ind={ind}
													detail={row}
													clientList={this.state.clientList}
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
													onFocus={() => this.validateSale(ind)}
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
							getRecoveryFields={this.getRecoveryFields}
							onDelete={this.props.deleteRecovery}
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
		getClient: () => dispatch(actions.getClient()),
		getSale: () => dispatch(actions.getSale()),
		recoverySave: (data) => dispatch(actions.recoverySave(data)),
		getRecovery: () => dispatch(actions.getRecovery()),
		updateRecovery: (data) => dispatch(actions.updateRecovery(data)),
		deleteRecovery: (id) => dispatch(actions.deleteRecovery(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Recovery));
