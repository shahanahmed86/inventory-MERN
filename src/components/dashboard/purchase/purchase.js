import React, { Component } from 'react';
import {
    withStyles,
    Paper, Typography,
    TextField, Fab,
    Table, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';

import GetVendors from './getlistVendors';
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
            }],
            editing: false,
        }
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
        inputProducts[ind][name] = value;
        this.setState({ inputProducts });
    }
    onAddRow = () => {
        const inputProducts = [...this.state.inputProducts];
        inputProducts.push({
            productId: '',
            productName: '',
            quantity: 0,
            costPrice: 0,
            value: 0,
        });
        this.setState({ inputProducts });
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
                quantity: 0,
                costPrice: 0,
                value: 0,
            }]
        });
    }
    onSaveHandler = () => {
        const { _id, date, invoice, vendorId, inputProducts, editing } = this.state;
        if (!editing) return this.props.purchaseSave({ date, invoice, vendorId, inputProducts });
        return this.props.updatePurchase({ _id, date, invoice, vendorId, inputProducts });
    }
    onBrowseHandler = () => {
        console.log('empty block')
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
                quantity: 0,
                costPrice: 0,
                value: 0,
            }],
            editing: false,
        })
    }
    getItemVendor = id => {
        const vendor = this.props.store.vendors.find(val => val._id === id);
        this.setState({
            vendorId: vendor._id,
            vendorName: vendor.vendorName,
        });
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
                        disabled={true}
                        type='text'
                        margin='dense'
                        label='Vendor'
                        name='vendorName' value={vendorName}
                        onChange={this.handleChange}
                        variant='standard'
                    />
                    <button
                        style={{ marginTop: 15, marginLeft: 3 }}
                        onClick={() => this.props.getVendor()}
                    >?</button>
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
                                                />
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
                </Paper>
                <GetVendors
                    getItem={this.getItemVendor}
                />
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { store }
};

const mapDispatchToProps = dispatch => {
    return {
        getVendor: () => dispatch(actions.getVendor()),
        getProduct: () => dispatch(actions.getProduct()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Purchase));