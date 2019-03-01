import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from 'react-redux';

import actions from '../store/actions';

class PositionedSnackbar extends Component {
    state = {
        vertical: 'bottom',
        horizontal: 'left',
    };

    render() {
        const { vertical, horizontal } = this.state;
        const { isSnackOpen, snackMessage } = this.props.store;
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={isSnackOpen}
                    onClose={this.props.onCloseSnack}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{snackMessage}</span>}
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
        onCloseSnack: () => dispatch(actions.onCloseSnack(false))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionedSnackbar);