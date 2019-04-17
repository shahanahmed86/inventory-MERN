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
import PopupVendor from './popup-vendor';
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

class Purchase extends Component {
	constructor() {
		super();
		this.state = {
			_id: '',
			date: '',
			invoice: '',
			vendorId: '',
			vendorName: '',
			inputProducts: [
				{
					productId: '',
					productName: '',
					quantity: '0',
					costPrice: '0',
					value: '0',
					sellingPrice: '0',
					productList: false
				}
			],
			editing: false,
			vendorList: false,
			search: '',
			options: false,
			getPur: false
		};
	}
	componentDidMount() {
		this.props.getPurchase();
		this.props.getVendor();
		this.props.getProduct();
		channel.bind('inventory', 'purchases', () => {
			this.props.getPurchase();
		});
		channel.bind('inventory', 'vendors', () => {
			this.props.getVendor();
		});
		channel.bind('inventory', 'products', () => {
			this.props.getProduct();
		});
	}
	onClearHandler = () => {
		this.setState({
			_id: '',
			date: '',
			invoice: '',
			vendorId: '',
			vendorName: '',
			inputProducts: [
				{
					productId: '',
					productName: '',
					quantity: '0',
					costPrice: '0',
					value: '0',
					sellingPrice: ''
				}
			],
			editing: false
		});
	};
	onAddRow = () => {
		const inputProducts = [ ...this.state.inputProducts ];
		const isFilled = [];
		inputProducts.forEach((x) => {
			isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
		});
		if (isFilled.every((val) => Boolean(val))) {
			inputProducts.push({
				productId: '',
				productName: '',
				quantity: '0',
				costPrice: '0',
				value: '0',
				sellingPrice: '0',
				productList: false
			});
			return this.setState({ inputProducts });
		}
		return this.props.onSnackHandler(true, 'Please fill previous row first');
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
					costPrice: '0',
					value: '0',
					sellingPrice: '0',
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
		if (name === 'quantity' || name === 'costPrice') {
			inputProducts[ind][name] = value;
			return this.calcValue(ind);
		}
		inputProducts[ind][name] = value;
		this.setState({ inputProducts });
	};
	calcValue = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		inputProducts[ind].value = inputProducts[ind].quantity * inputProducts[ind].costPrice;
		this.setState({ inputProducts });
	};
	onSaveHandler = () => {
		const { date, invoice, vendorId, inputProducts, editing } = this.state;
		if (!editing) return this.props.purchaseSave({ date, invoice, vendorId, products: inputProducts });
		// return this.props.updatePurchase({ _id, date, invoice, vendorId, products: inputProducts });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			options: !state.options
		}));
	};
	validateSearch = (ev) => {
		if (ev.keyCode === 13) return this.setState({ getPur: true });
		if (ev.keyCode === 27) return this.setState({ getPur: false });
	};
	getPurchaseFields = (id) => {
		const purchases = this.props.store.purchases.find((val) => val._id === id);
		const { _id, date, invoice, vendorId, products } = purchases;
		this.setState({
			_id,
			date: date.slice(0, 10),
			invoice,
			vendorId: vendorId._id,
			vendorName: vendorId.vendorName,
			inputProducts: products.map((val) => {
				return {
					_id: val._id,
					productId: val.productId._id,
					productName: val.productId.productName,
					quantity: val.quantity,
					costPrice: val.costPrice,
					value: val.value,
					sellingPrice: val.sellingPrice
				};
			}),
			editing: true,
			getPur: false,
			options: false
		});
	};
	validateVendor = (ev) => {
		if (ev.keyCode === 13) return this.setState({ vendorList: true });
		if (ev.keyCode === 27) return this.setState({ vendorList: false });
	};
	getVendorFields = (vendorId, vendorName) => {
		this.setState({
			vendorId,
			vendorName,
			vendorList: false
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
				if (val.productName === name) return this.props.onSnackHandler(true, "can't enter same product");
			}
		});
		inputProducts[ind].productId = id;
		inputProducts[ind].productName = name;
		inputProducts[ind].productList = false;
		this.setState({ inputProducts });
	};
	// starts working for this code
	checkQty = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		if (inputProducts[ind].productId) {
			const { purchases, sales } = this.props.store;
			const errorFound = { match: false };
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
			if (errorFound.match) {
				return (inputProducts[ind].err = 'Stock is not available');
			} else {
				inputProducts[ind].err = false;
			}
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
	// end working for this code
	render() {
		const { date, invoice, vendorName, inputProducts, editing } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<Paper elevation={24} className="pb-form">
					<Typography
						children="Purchase Form"
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
						type="text"
						margin="dense"
						label="Invoice"
						variant="standard"
						name="invoice"
						value={invoice}
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
										<CustomTableCell>Product</CustomTableCell>
										<CustomTableCell>Quantity</CustomTableCell>
										<CustomTableCell>Cost</CustomTableCell>
										<CustomTableCell>Value</CustomTableCell>
										<CustomTableCell>Selling</CustomTableCell>
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
													vendorList={this.state.vendorList}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="quantity"
													value={row.quantity}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="costPrice"
													value={row.costPrice}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													disabled={true}
													type="text"
													variant="standard"
													name="value"
													value={parseInt(row.value).toLocaleString()}
													onChange={(ev) => this.handleChangeTab(ev, ind)}
												/>
											</CustomTableCell>
											<CustomTableCell>
												<TextField
													type="text"
													variant="standard"
													name="sellingPrice"
													value={row.sellingPrice}
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
							getPur={this.state.getPur}
							validateSearch={this.validateSearch}
							getPurchaseFields={this.getPurchaseFields}
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
		getProduct: () => dispatch(actions.getProduct()),
		purchaseSave: (data) => dispatch(actions.purchaseSave(data)),
		getPurchase: () => dispatch(actions.getPurchase())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Purchase));
