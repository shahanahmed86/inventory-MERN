import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    withStyles, withMobileDialog,
    Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Fab
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import actions from '../../../store/actions'

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
        minWidth: 1100,
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    fab: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
});

class CustomizedTable extends Component {
    handleClose = () => {
        this.props.onDialog(false);
    }
    getRow = id => {
        this.props.onEdit(id);
        this.handleClose();
    }
    render() {
        const { classes, fullScreen } = this.props;
        const { vendors, isDialogOpen } = this.props.store;
        if (isDialogOpen && vendors.length) return (
            <Dialog
                open={this.props.store.isDialogOpen}
                onClose={this.handleClose}
                fullScreen={fullScreen}
                maxWidth='xl'
                scroll='paper'
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle style={{ paddingBottom: 0 }} id="responsive-dialog-title">{"Vendors' Details"}</DialogTitle>
                <div className={classes.root}>
                    <DialogContent>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Serial</CustomTableCell>
                                    <CustomTableCell>Vendor Name</CustomTableCell>
                                    <CustomTableCell>Address</CustomTableCell>
                                    <CustomTableCell>Telephone</CustomTableCell>
                                    <CustomTableCell>Email</CustomTableCell>
                                    <CustomTableCell>NTN</CustomTableCell>
                                    <CustomTableCell>Options</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendors.map((row, ind) => (
                                    <TableRow className={classes.row} key={ind}>
                                        <CustomTableCell component="th" scope="row">
                                            {ind + 1}
                                        </CustomTableCell>
                                        <CustomTableCell>{row.vendorName}</CustomTableCell>
                                        <CustomTableCell>{row.address}</CustomTableCell>
                                        <CustomTableCell>{row.telephone}</CustomTableCell>
                                        <CustomTableCell>{row.email}</CustomTableCell>
                                        <CustomTableCell>{row.ntn}</CustomTableCell>
                                        <CustomTableCell>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-evenly'
                                            }}>
                                                <Fab
                                                    size='small'
                                                    color="primary"
                                                    aria-label="Edit"
                                                    className={classes.fab}
                                                    onClick={() => this.getRow(row._id)}
                                                >
                                                    <Icon>edit_icon</Icon>
                                                </Fab>
                                                <Fab
                                                    size='small'
                                                    color='secondary'
                                                    aria-label="Delete"
                                                    className={classes.fab}
                                                    onClick={() => this.props.deleteVendor(row._id)}
                                                >
                                                    <DeleteIcon />
                                                </Fab>
                                            </div>
                                        </CustomTableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </DialogContent>
                </div>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                        Close
                    </Button>
                </DialogActions>
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
        deleteVendor: id => dispatch(actions.deleteVendor(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withMobileDialog()(withStyles(styles)(CustomizedTable)));