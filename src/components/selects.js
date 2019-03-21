import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        marginTop: theme.spacing.unit * 0.50,
        marginBottom: theme.spacing.unit * 0.50,
        minWidth: '100%',
    },
});

class NativeSelects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            labelWidth: 0,
        }
    }

    componentDidMount() {
        this.setState({
            labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        });
    }

    render() {
        const { classes, range, criteria, theLabel, theField, toChange } = this.props;
        console.log(range);
        return (
            <div className={classes.root}>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel
                        ref={ref => {
                            this.InputLabelRef = ref;
                        }}
                        htmlFor="values-for-select-list"
                    >
                        {theLabel}
                    </InputLabel>
                    <Select
                        native
                        value={theField}
                        onChange={toChange}
                        input={
                            <OutlinedInput
                                name={criteria}
                                labelWidth={this.state.labelWidth}
                                id="values-for-select-list"
                            />
                        }
                    >
                        <option value="" />
                        {range.map((val, ind) => {
                            return (
                                <option key={ind} value={val}>{val}</option>
                            );
                        })}
                    </Select>
                </FormControl>
            </div>
        );
    }
}

NativeSelects.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NativeSelects);