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
import PopupVendor from '../popup-vendor';
import PopupProduct from '../popup-product';
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
		channel.bind('sales', () => {
			this.props.getSale();
		});
		channel.bind('purchases', () => {
			this.props.getPurchase();
		});
		channel.bind('products', () => {
			this.props.getProduct();
		});
		channel.bind('vendors', () => {
			this.props.getVendor();
		});
	}
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
			this.calcValue(ind);
		} else {
			inputProducts[ind][name] = value;
		}
		this.setState({ inputProducts });
	};
	calcValue = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		inputProducts[ind].value = inputProducts[ind].quantity * inputProducts[ind].costPrice;
		this.setState({ inputProducts });
	};
	onSaveHandler = () => {
		const { _id, date, invoice, vendorId, inputProducts, editing } = this.state;
		if (!editing) return this.props.purchaseSave({ date, invoice, vendorId, products: inputProducts });
		return this.props.updatePurchase({ _id, date, invoice, vendorId, products: inputProducts });
	};
	onBrowseHandler = () => {
		this.setState((state) => ({
			options: !state.options
		}));
	};
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
			options: false,
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
	checkStock = () => {
		const { purchases, sales, products } = this.props.store;
		const stockSum = {};
		products.forEach((x) => (stockSum[x._id] = 0));
		purchases.forEach((x) => x.products.forEach((y) => (stockSum[y.productId._id] += y.quantity)));
		sales.forEach((x) => x.products.forEach((y) => (stockSum[y.productId._id] -= y.quantity)));
		return stockSum;
	};
	checkQty = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		const products = this.props.store.products;
		if (this.state.editing) {
			const stock = this.checkStock();
			if (inputProducts[ind].oldProductId) {
				if (inputProducts[ind].oldProductId === inputProducts[ind].productId) {
					const qty =
						+stock[inputProducts[ind].oldProductId] -
						+inputProducts[ind].oldQuantity +
						+inputProducts[ind].quantity;
					if (qty < 0) {
						const name = products.find((x) => x._id === inputProducts[ind].oldProductId).productName;
						inputProducts[ind].err = `${name} will be negative by ${qty}`;
					} else {
						inputProducts[ind].err = false;
					}
					this.setState({ inputProducts });
				}
			} else {
				const qty = +stock[inputProducts[ind].oldProductId] - +inputProducts[ind].oldQuantity;
				if (qty < 0) {
					const name = products.find((x) => x._id === inputProducts[ind].oldProductId).productName;
					inputProducts[ind].err = `${name} will be negative by ${qty}`;
				} else {
					inputProducts[ind].err = false;
				}
				this.setState({ inputProducts });
			}
		}
	};
	onRemoveRow = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		const products = this.props.store.products;
		if (this.state.editing) {
			const stock = this.checkStock();
			if (inputProducts[ind].oldProductId) {
				const qty = +stock[inputProducts[ind].oldProductId] - +inputProducts[ind].oldQuantity;
				if (qty < 0) {
					const name = products.find((x) => x._id === inputProducts[ind].oldProductId).productName;
					inputProducts[ind].err = `${name} will be negative by ${qty}`;
					this.setState({ inputProducts });
				} else {
					this.onDeleteRow(ind);
				}
			} else {
				this.onDeleteRow(ind);
			}
		} else {
			this.onDeleteRow(ind);
		}
	};
	onDeleteRow = (ind) => {
		const inputProducts = [ ...this.state.inputProducts ];
		if (inputProducts.length > 1) {
			inputProducts[ind].productList = false;
			inputProducts.splice(ind, 1);
			this.setState({ inputProducts });
		} else {
			this.setState({
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
		}
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
					oldProductId: val.productId._id,
					productName: val.productId.productName,
					quantity: val.quantity,
					oldQuantity: val.quantity,
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
													onBlur={() => this.checkQty(ind)}
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
													error={Boolean(row.err)}
													helperText={row.err && row.err}
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
							onDelete={this.props.deletePurchase}
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
		getPurchase: () => dispatch(actions.getPurchase()),
		updatePurchase: (data) => dispatch(actions.updatePurchase(data)),
		deletePurchase: (id) => dispatch(actions.deletePurchase(id)),
		getSale: () => dispatch(actions.getSale())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Purchase));
