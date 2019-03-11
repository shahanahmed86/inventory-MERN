import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    withStyles,
    Table, TableBody, TableCell, TableHead, TableRow,
    Paper, Dialog
} from '@material-ui/core'
import { connect } from 'react-redux';
import actions from '../../../store/actions'

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const styles = theme => ({
    root: {
        width: 'fit-content',
        padding: 15,
        marginTop: theme.spacing.unit * 3,
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
});

class CustomizedTable extends Component {
    handleClose = () => {
        this.props.onDialog(false);
    }
    render() {
        const { classes } = this.props;
        const { products, isDialogOpen } = this.props.store;
        if (isDialogOpen) return (
            <Dialog
                open={this.props.store.isDialogOpen}
                onClose={this.handleClose}
            >
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Serial</CustomTableCell>
                                <CustomTableCell>Product Name</CustomTableCell>
                                <CustomTableCell>Manufacturer</CustomTableCell>
                                <CustomTableCell>Description</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((row, ind) => (
                                <TableRow className={classes.row} key={ind}>
                                    <CustomTableCell component="th" scope="row">
                                        {ind + 1}
                                    </CustomTableCell>
                                    <CustomTableCell>{row.productName}</CustomTableCell>
                                    <CustomTableCell>{row.manufacturer}</CustomTableCell>
                                    <CustomTableCell>{row.description}</CustomTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Dialog>
        );
        return null;
    }
}

CustomizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return { store }
}

const mapDispatchToProps = dispatch => {
    return {
        onDialog: data => dispatch(actions.onDialog(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomizedTable));