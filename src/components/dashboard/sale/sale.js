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
import PopupClient from './popup-client';
import PopupProduct from './../popup-product';
import actions from '../../../store/actions';

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
	}
});

class Sale extends Component {
	constructor() {
		super();
		this.state = {
			_id: '',
			date: '',
			invoice: '',
			clientId: '',
			clientName: '',
			inputProducts: [
				{
					productId: '',
					productName: '',
					quantity: '0',
					sellingPrice: '0',
					value: '0',
					productList: false,
					err: false
				}
			],
			editing: false,
			clientList: false,
			search: '',
			options: false,
			getSal: false
		};
	}
	componentDidMount() {
		this.props.getClient();
		this.props.getProduct();
		this.props.getSale();
		this.props.getPurchase();
		channel.bind('sales', () => {
			this.props.getSale();
		});
		channel.bind('purchases', () => {
			this.props.getPurchase();
		});
		channel.bind('products', () => {
			this.props.getProduct();
		});
		channel.bind('clients', () => {
			this.props.getClient();
		});
	}
	onClearHandler = () => {
		this.setState({
			_id: '',
			date: '',
			invoice: '',
			clientId: '',
			clientName: '',
			inputProducts: [
				{
					productId: '',
					productName: '',
					quantity: '0',
					sellingPrice: '0',
					value: '0',
					productList: false,
					err: false
				}
			],
			editing: false,
			clientList: false,
			search: '',
			options: false,
			getSal: false
		});
	};
	onAddRow = () => {
		const inputProducts = [ ...this.state.inputProducts ];
		const isFilled = [];
		inputProducts.forEach((x) => isFilled.push(Object.values(x).every((y) => y === false || Boolean(y))));
		if (isFilled.every((val) => Boolean(val))) {
			inputProducts.push({
				productId: '',
				productName: '',
				quantity: '0',
				sellingPrice: '0',
				value: '0',
				productList: false
			});
			return this.setState({ inputProducts });
		}
		return this.props.onSnackHandler(true, 'Please fill previous row(s) first');
	};
	onRemoveRow = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		if (inputProducts.length > 1) {
			inputProducts[ind].productList = false;
			inputProducts.splice(ind, 1);
			return this.setState({ inputProducts });
		}
		return this.setState({
			inputProducts: [
				{
					productId: '',
					productName: '',
					quantity: '0',
					sellingPrice: '0',
					value: '0',
					productList: false
				}
			]
		});
	};
	handleChange = (ev) => {
		const { name, value } = ev.target;
		this.setState({
			[name]: value
		});
	};
	handleChangeTab = (ev, ind) => {
		const { name, value } = ev.target;
		const inputProducts = [ ...this.state.inputProducts ];
		if (name === 'quantity' || name === 'sellingPrice') {
			inputProducts[ind][name] = value;
			this.calcValue(ind);
		} else {
			inputProducts[ind][name] = value;
		}
		this.setState({ inputProducts });
	};
	calcValue = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		inputProducts[ind].value = inputProducts[ind].quantity * inputProducts[ind].sellingPrice;
		this.setState({ inputProducts });
	};
	onSaveHandler = () => {
		const { _id, date, invoice, clientId, inputProducts, editing } = this.state;
		if (!editing) return this.props.saleSave({ date, invoice, clientId, products: inputProducts });
		return this.props.updateSale({ _id, date, invoice, clientId, products: inputProducts });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			options: !state.options
		}));
	};
	validateSearch = (ev) => {
		if (ev.keyCode === 13) return this.setState({ getSal: true });
		if (ev.keyCode === 27) return this.setState({ getSal: false });
	};
	getSaleFields = (id) => {
		const sales = this.props.store.sales.find((val) => val._id === id);
		const { _id, date, invoice, clientId, products } = sales;
		this.setState({
			_id,
			date: date.slice(0, 10),
			invoice,
			clientId: clientId._id,
			clientName: clientId.clientName,
			inputProducts: products.map((val) => {
				return {
					productId: val.productId._id,
					productName: val.productId.productName,
					quantity: val.quantity,
					sellingPrice: val.sellingPrice,
					value: val.value,
					oldProductId: val.productId._id,
					oldQuantity: val.quantity
				};
			}),
			editing: true,
			options: false,
			getSal: false
		});
	};
	validateClient = (ev) => {
		if (ev.keyCode === 13) return this.setState({ clientList: true });
		if (ev.keyCode === 27) return this.setState({ clientList: false });
	};
	getClientFields = (clientId, clientName) => {
		this.setState({
			clientId,
			clientName,
			clientList: false
		});
	};
	validateProduct = (ev, ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		if (ev.keyCode === 13) inputProducts[ind].productList = true;
		if (ev.keyCode === 27) inputProducts[ind].productList = false;
		this.setState({ ind, inputProducts });
	};
	getProductFields = (id, name) => {
		const inputProducts = [ ...this.state.inputProducts ];
		const ind = this.state.ind;
		inputProducts.forEach((val, i) => {
			if (i !== ind) {
				if (val.productName === name)
					return this.props.onSnackHandler(true, `can't enter same product (${name}) again`);
			}
		});
		inputProducts[ind].productId = id;
		inputProducts[ind].productName = name;
		inputProducts[ind].productList = false;
		this.setState({ inputProducts });
	};
	checkQty = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		if (inputProducts[ind].productId) {
			const { purchases, sales } = this.props.store;
			const stockIn = [];
			purchases.forEach((val) => {
				val.products.forEach((value) => {
					if (value.productId._id === inputProducts[ind].productId) {
						inputProducts[ind].sellingPrice = value.sellingPrice;
						stockIn.push(value);
					} else {
						inputProducts[ind].sellingPrice = 0;
					}
				});
			});
			const stockOut = [];
			sales.forEach((val) => {
				val.products.forEach((value) => {
					if (value.productId._id === inputProducts[ind].productId) {
						stockOut.push(value);
					}
				});
			});
			if (!this.state.editing) {
				const qty = this.isStockFound(stockIn, stockOut) - +inputProducts[ind].quantity;
				if (qty < 0) {
					return (inputProducts[ind].err = `will be negative by ${qty}`);
				} else {
					inputProducts[ind].err = false;
				}
			} else {
				if (inputProducts[ind].oldProductId === inputProducts[ind].productId) {
					const qty =
						this.isStockFound(stockIn, stockOut) +
						+inputProducts[ind].oldQuantity -
						+inputProducts[ind].quantity;
					if (qty < 0) {
						return (inputProducts[ind].err = `will be negative by ${qty}`);
					} else {
						inputProducts[ind].err = false;
					}
				} else {
					const qty = this.isStockFound(stockIn, stockOut) - +inputProducts[ind].quantity;
					if (qty < 0) {
						return (inputProducts[ind].err = `will be negative by ${qty}`);
					} else {
						inputProducts[ind].err = false;
					}
				}
			}
			this.setState({
				inputProducts
			});
		} else {
			return (inputProducts[ind].err = 'Please select the product first');
		}
	};
	isStockFound = (stockIn, stockOut) => {
		const sumStockIn = Object.values(stockIn).reduce((cum, cur) => cum + cur.quantity, 0);
		const sumStockOut = Object.values(stockOut).reduce((cum, cur) => cum + cur.quantity, 0);
		return sumStockIn - sumStockOut;
	};
	render() {
		const { date, invoice, clientName, inputProducts, editing } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<Paper elevation={24} className="pb-form">
					<Typography
						children="Sale Form"
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
						disabled={editing ? true : false}
						type="text"
						margin="dense"
						label="Invoice"
						variant="standard"
						name="invoice"
						value={invoice}
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
										<CustomTableCell>Product</CustomTableCell>
										<CustomTableCell>Quantity</CustomTableCell>
										<CustomTableCell>Selling</CustomTableCell>
										<CustomTableCell>Value</CustomTableCell>
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
									{inputProducts.map((row, ind) => (
										<TableRow className={classes.row} key={ind}>
											<CustomTableCell>
												<PopupProduct
													getProductFields={this.getProductFields}
													productName={row.productName}
													ind={ind}
													inputProducts={inputProducts}
													handleChangeTab={this.handleChangeTab}
													validateProduct={this.validateProduct}
													clientList={this.state.clientList}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="quantity"
													value={row.quantity}
													onBlur={() => this.checkQty(ind)}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="sellingPrice"
													value={row.sellingPrice}
													onFocus={() => this.calcValue(ind)}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													disabled={true}
													type="text"
													variant="standard"
													name="value"
													error={Boolean(row.err)}
													helperText={row.err && row.err}
													value={parseInt(row.value).toLocaleString()}
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
										<CustomTableCell>
											{inputProducts
												.reduce((sum, val) => parseInt(sum) + parseInt(val.quantity), 0)
												.toLocaleString()}
										</CustomTableCell>
										<CustomTableCell />
										<CustomTableCell>
											{inputProducts
												.reduce((sum, val) => parseInt(sum) + parseInt(val.value), 0)
												.toLocaleString()}
										</CustomTableCell>
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
							getSal={this.state.getSal}
							validateSearch={this.validateSearch}
							getSaleFields={this.getSaleFields}
							onDelete={this.props.deleteSale}
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
		getProduct: () => dispatch(actions.getProduct()),
		saleSave: (data) => dispatch(actions.saleSave(data)),
		updateSale: (data) => dispatch(actions.updateSale(data)),
		getSale: () => dispatch(actions.getSale()),
		getSaleSuccess: () => dispatch(actions.getSaleSuccess()),
		deleteSale: (id) => dispatch(actions.deleteSale(id)),
		getPurchase: () => dispatch(actions.getPurchase())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sale));
