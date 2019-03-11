import React, { Component } from 'react';
import {
    Paper, TextField, Typography
} from '@material-ui/core';
import { connect } from 'react-redux';

import CustomTableCell from './detail';

import actions from '../../../store/actions';

class Product extends Component {
    constructor() {
        super();
        this.state = {
            productName: '',
            manufacturer: '',
            description: '',
        }
    }
    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value
        });
    }
    onSaveHandler = () => {
        this.props.productSave(this.state);
    }
    onBrowseHandler = () => {
        this.props.getProduct();
    }
    onClearHandler = () => {
        this.setState({
            productName: '',
            manufacturer: '',
            description: '',
        });
    }
    render() {
        const { productName, manufacturer, description } = this.state;
        return (
            <div>
                <Paper
                    elevation={24}
                    className='product-form'
                >
                    <Typography
                        children='Product Form'
                        align='center'
                        color='secondary'
                        gutterBottom={true}
                        variant='h5'
                    />
                    <TextField
                        type='text'
                        margin='dense'
                        label='Product Name'
                        name='productName' value={productName}
                        onChange={this.handleChange}
                        variant='filled'
                        fullWidth={true}
                    />
                    <TextField
                        type='text'
                        margin='dense'
                        label='Manufacturer'
                        name='manufacturer' value={manufacturer}
                        onChange={this.handleChange}
                        variant='filled'
                        fullWidth={true}
                    />
                    <TextField
                        type='text'
                        margin='dense'
                        label='Description'
                        name='description' value={description}
                        onChange={this.handleChange}
                        variant='filled'
                        fullWidth={true}
                    />
                    <div className='buttons-group'>
                        <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                        >
                            <button
                                className="btn btn-success"
                                onClick={this.onSaveHandler}
                            >
                                Save
                        </button>
                            <button
                                className="btn btn-secondary"
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
                <CustomTableCell />
            </div>
        );
    }
}

const mapStateToProps = store => {
    return { store }
};

const mapDispatchToProps = dispatch => {
    return {
        productSave: data => dispatch(actions.productSave(data)),
        getProduct: () => dispatch(actions.getProduct()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);