import React, { Component } from 'react';
import {
    withStyles,
    Paper, Typography,
    TextField, Fab, Icon,
    Table, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';

import actions from "../../../store/actions";

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textAlign: 'center',
        padding: 5
    },
    body: {
        fontSize: 14,
        padding: 5
    },
}))(TableCell);

const styles = theme => ({
    root: {
        width: '100%',
        padding: 5,
        marginTop: theme.spacing.unit,
        overflowX: 'auto',
    },
    table: {
        minWidth: 'fit-content',
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    fab: {
        margin: theme.spacing.unit,
    },
    formControl: {
        minWidth: 200,
    },
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
            inputProducts: [{
                productId: '',
                productName: '',
                quantity: 0,
                costPrice: 0,
                value: 0,
                productList: false,
            }],
            editing: false,
            vendorList: false,
            search: '',
            options: false,
        }
    }
    onAddRow = () => {
        const inputProducts = [...this.state.inputProducts];
        const lastRow = inputProducts[inputProducts.length - 1];
        const isFilled = Object.values(lastRow).every(val => val === false || Boolean(val));
        if (isFilled) {
            inputProducts.push({
                productId: '',
                productName: '',
                quantity: '0',
                costPrice: '0',
                value: '0',
            });
            return this.setState({ inputProducts });
        } else {
            return this.props.onSnackHandler(true, 'Please fill previous row first');
        }
    }
    onRemoveRow = ind => {
        const inputProducts = [...this.state.inputProducts];
        if (inputProducts.length > 1) {
            inputProducts.splice(ind, 1);
            return this.setState({ inputProducts });
        }
        return this.setState({
            inputProducts: [{
                productId: '',
                productName: '',
                quantity: '0',
                costPrice: '0',
                value: '0',
            }]
        });
    }
    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value
        });
    }
    handleChangeTab = (ev, ind) => {
        const { name, value } = ev.target;
        const inputProducts = [...this.state.inputProducts];
        if (name === 'quantity' || name === 'costPrice') {
            inputProducts[ind][name] = value;
            return this.calcValue(ind);
        }
        inputProducts[ind][name] = value;
        this.setState({ inputProducts });
    }
    calcValue = ind => {
        const inputProducts = [...this.state.inputProducts];
        inputProducts[ind].value = inputProducts[ind].quantity * inputProducts[ind].costPrice;
        this.setState({ inputProducts });
    }
    onSaveHandler = () => {
        const { _id, date, invoice, vendorId, inputProducts, editing } = this.state;
        if (!editing) return this.props.purchaseSave({ date, invoice, vendorId, products: inputProducts });
        return this.props.updatePurchase({ _id, date, invoice, vendorId, products: inputProducts });
    }
    onBrowseHandler = () => {
        this.setState(state => ({
            options: !state.options
        }));
    }
    toShowOptions = () => {
        const { search } = this.state;
        return (
            <div className='simple-flex'>
                <TextField
                    type='text'
                    margin='dense'
                    variant='standard'
                    label='Type Invoice #'
                    name='search' value={search}
                    onChange={this.handleChange}
                    onFocus={this.validateSearch}
                    onBlur={this.onClosePurchaseList}
                />
                <div className="btn-group">
                    <Fab
                        size='small'
                        color="primary"
                        aria-label="Edit"
                    >
                        <Icon>edit_icon</Icon>
                    </Fab>
                    <Fab
                        size='small'
                        color='secondary'
                        aria-label="Delete"
                    >
                        <DeleteIcon />
                    </Fab>
                </div>
            </div>
        );
    }
    validateSearch = () => {
        this.props.getPurchase();
        this.setState({ getPur: true });
    }
    renderSearchBlock = () => {
        const invoice = this.state.invoice.toLowerCase();
        const purchases = this.props.store.purchases.filter(val => val.invoice.toLowerCase().indexOf(invoice) !== -1);
        return (
            <Paper
                elevation={24}
                className='popout-block'
            >
                {purchases.length ? purchases.map((val, ind) => {
                    return (
                        <ul className="list-group" key={ind}>
                            <li className="list-group-item">
                                <button
                                    className='btn btn-secondary'
                                    onClick={() => this.getPurchaseFields(val._id)}
                                >
                                    {val.invoice}
                                </button>
                            </li>
                            <li className="list-group-item">Date: {val.date}</li>
                            <li className="list-group-item">Vendor: {val.vendor}</li>
                        </ul>
                    );
                }) : <h4 className='simple-flex'>Empty</h4>}
            </Paper>
        )
    }
    getPurchaseFields = id => {
        const purchase = this.props.store.purchases.find(val => val._id === id);
        this.props.onDialog(false);
        console.log({ purchase });
    }
    onClosePurchaseList = () => {
        setTimeout(() => {
            this.setState({ getPur: false });
        }, 500);
    }
    onClearHandler = () => {
        this.setState({
            _id: '',
            date: '',
            invoice: '',
            vendorId: '',
            vendorName: '',
            inputProducts: [{
                productId: '',
                productName: '',
                quantity: '0',
                costPrice: '0',
                value: '0',
            }],
            editing: false,
        })
    }
    validateVendor = () => {
        this.props.getVendor();
        this.setState({ vendorList: true });
    }
    renderSearchBlockVendor = () => {
        const search = this.state.vendorName.toLowerCase();
        const vendors = this.props.store.vendors.filter(val => val.vendorName.toLowerCase().indexOf(search) !== -1);
        return (
            <Paper
                elevation={24}
                className='popout-block'
            >
                {vendors.length ? vendors.map((val, ind) => {
                    return (
                        <ul className="list-group" key={ind}>
                            <li className="list-group-item">
                                <button
                                    className='btn btn-secondary'
                                    onClick={() => this.getVendorFields(val._id, val.vendorName)}
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
                }) : <h4 className='simple-flex'>Empty</h4>}
            </Paper>
        )
    }
    getVendorFields = (vendorId, vendorName) => {
        this.setState({
            vendorId, vendorName,
            vendorList: false
        });
        this.props.onDialog(false);
    }
    onCloseVendorList = () => {
        setTimeout(() => {
            this.setState({ vendorList: false });
        }, 500);
    }
    validateProduct = ind => {
        this.props.getProduct();
        const inputProducts = [...this.state.inputProducts];
        inputProducts[ind].productList = true;
        this.setState({ ind, inputProducts });
    }
    renderSearchBlockProduct = () => {
        const search = this.state.inputProducts[this.state.ind].productName.toLowerCase();
        const products = this.props.store.products.filter(val => val.productName.toLowerCase().indexOf(search) !== -1);
        return (
            <Paper
                elevation={24}
                className='popout-block'
            >
                {products.length ? products.map((val, ind) => {
                    return (
                        <ul className="list-group" key={ind}>
                            <li className="list-group-item">
                                <button
                                    className='btn btn-secondary'
                                    onClick={() => this.getProductFields(val._id, val.productName)}
                                >
                                    {val.productName}
                                </button>
                            </li>
                            <li className="list-group-item">Manufacturer: {val.manufacturer}</li>
                            <li className="list-group-item">Description: {val.description}</li>
                        </ul>
                    );
                }) : <h4 className='simple-flex'>Empty</h4>}
            </Paper>
        )
    }
    getProductFields = (id, name) => {
        const inputProducts = [...this.state.inputProducts];
        const ind = this.state.ind;
        inputProducts.forEach((val, i) => {
            if (i !== ind) {
                if (val.productName === name) return this.props.onSnackHandler(true, 'can\'t enter same product');
            }
        });
        inputProducts[ind].productId = id;
        inputProducts[ind].productName = name;
        inputProducts[ind].productList = false;
        this.setState({ inputProducts });
        this.props.onDialog(false);
    }
    onCloseProductList = ind => {
        const inputProducts = [...this.state.inputProducts];
        inputProducts[ind].productList = false;
        setTimeout(() => {
            this.setState({ inputProducts });
        }, 500);
    }
    render() {
        const {
            date, invoice, vendorName, inputProducts,
            editing
        } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Paper
                    elevation={24}
                    className='pb-form'
                >
                    <Typography
                        children='Purchase Form'
                        align='center'
                        color='secondary'
                        gutterBottom={true}
                        variant='h5'
                    />
                    <TextField
                        type='date'
                        margin='dense'
                        InputLabelProps={{ shrink: true }}
                        label='Date'
                        name='date' value={date}
                        onChange={this.handleChange}
                        variant='standard'
                    /><br />
                    <TextField
                        type='text'
                        margin='dense'
                        label='Invoice'
                        name='invoice' value={invoice}
                        onChange={this.handleChange}
                        variant='standard'
                    /><br />
                    <TextField
                        type='text'
                        margin='dense'
                        variant='standard'
                        label='Vendor'
                        name='vendorName' value={vendorName}
                        onChange={this.handleChange}
                        onFocus={this.validateVendor}
                        onBlur={this.onCloseVendorList}
                    />
                    {this.state.vendorList && this.renderSearchBlockVendor()}
                    <div className='row'>
                        <div className='col-xs-12'>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <CustomTableCell>Product</CustomTableCell>
                                        <CustomTableCell>Quantity</CustomTableCell>
                                        <CustomTableCell>Cost</CustomTableCell>
                                        <CustomTableCell>Value</CustomTableCell>
                                        <CustomTableCell style={{
                                            padding: 3
                                        }}>
                                            x
                                        </CustomTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inputProducts.map((row, ind) => (
                                        <TableRow className={classes.row} key={ind}>
                                            <CustomTableCell>
                                                <TextField
                                                    type='text'
                                                    variant='standard'
                                                    name='productName' value={row.productName}
                                                    onChange={ev => this.handleChangeTab(ev, ind)}
                                                    onFocus={() => this.validateProduct(ind)}
                                                    onBlur={() => this.onCloseProductList(ind)}
                                                />
                                                {(!this.state.vendorList && row.productList) && this.renderSearchBlockProduct()}
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <TextField
                                                    type='number'
                                                    variant='standard'
                                                    name='quantity' value={row.quantity}
                                                    onChange={ev => this.handleChangeTab(ev, ind)}
                                                />
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <TextField
                                                    type='number'
                                                    variant='standard'
                                                    name='costPrice' value={row.costPrice}
                                                    onChange={ev => this.handleChangeTab(ev, ind)}
                                                />
                                            </CustomTableCell>
                                            <CustomTableCell>
                                                <TextField
                                                    disabled={true}
                                                    type='text'
                                                    variant='standard'
                                                    name='value' value={row.value.toLocaleString()}
                                                    onChange={ev => this.handleChangeTab(ev, ind)}
                                                />
                                            </CustomTableCell>
                                            <CustomTableCell style={{
                                                padding: 3
                                            }}>
                                                <Fab
                                                    size='small'
                                                    color='secondary'
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
                            </Table>
                        </div>
                    </div>
                    <Fab
                        size='small'
                        color='primary'
                        aria-label="Add"
                        onClick={this.onAddRow}
                    >
                        <AddIcon />
                    </Fab>
                    <div className='buttons-group'>
                        <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                        >
                            <button
                                className={editing ? "btn btn-secondary" : "btn btn-primary"}
                                onClick={this.onSaveHandler}
                            >
                                {editing ? 'Update' : 'Save'}
                            </button>
                            <button
                                className='btn btn-success'
                                onClick={this.onBrowseHandler}
                            >
                                Browse
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={this.onClearHandler}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    {this.state.options && this.toShowOptions()}
                    {(this.state.options && this.state.getPur) && this.renderSearchBlock()}
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { store }
};

const mapDispatchToProps = dispatch => {
    return {
        onSnackHandler: (snack, message) => dispatch(actions.onSnackHandler({ snack, message })),
        onDialog: data => dispatch(actions.onDialog(data)),
        getVendor: () => dispatch(actions.getVendor()),
        getProduct: () => dispatch(actions.getProduct()),
        purchaseSave: data => dispatch(actions.purchaseSave(data)),
        getPurchase: () => dispatch(actions.getPurchase()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Purchase));