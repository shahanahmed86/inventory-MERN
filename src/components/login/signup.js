import React, { Component } from 'react';
import {
    Paper, Typography, TextField,
    Button
} from '@material-ui/core';
import { connect } from 'react-redux';

import actions from '../../store/actions';
import NativeSelects from '../selects';
import '../../App.css';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            mobile: '',
            dob: '',
            first: '',
            last: '',
            gender: '',
            maritalStatus: '',
            cnic: '',
        }
    }
    componentDidMount() {
        if (this.props.store.profile.email) return this.props.history.push('/dashboard');
        return this.props.history.push('/signup');
    }
    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value
        });
    }
    gotoSignIn = () => {
        this.props.history.push('/');
    }
    onSignUpHandler = () => {
        const isFilled = Object.values(this.state).every(x => Boolean(x) === true);
        console.log(isFilled);
        if (isFilled) return this.props.signUp(this.state);
        return this.props.onSnackHandler(true, 'All Fields are required');
    }
    render() {
        const {
            email, password,
            confirmPassword, mobile, dob, first, last, gender, cnic, maritalStatus
        } = this.state;
        return (
            <div className='paper-style'>
                <Paper
                    elevation={4}
                    className='inner-paper-styling'
                >
                    <Typography
                        align='center'
                        color='primary'
                        variant='h5'
                        gutterBottom={true}
                    >
                        <span className='outline-it'>Login Portal</span>
                    </Typography>
                    <Typography
                        align='center'
                        color='textSecondary'
                        variant='h6'
                    >
                        Sign Up Form
                    </Typography>
                    <TextField
                        autoFocus
                        type='text'
                        name='email' value={email}
                        label='Email'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField
                        type='password'
                        name='password' value={password}
                        label='Password'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField
                        type='password'
                        name='confirmPassword' value={confirmPassword}
                        label='Confirm Password'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField
                        type='text'
                        name='mobile' value={mobile}
                        label='Mobile No.'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                        style={{ marginBottom: 15 }}
                        helperText={'example: 0300-1234567'}
                    />
                    <TextField
                        type='date'
                        name='dob' value={dob}
                        label='Date of Birth'
                        InputLabelProps={{ shrink: true }}
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField
                        type='text'
                        name='first' value={first}
                        label='First Name'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                    />
                    <TextField
                        type='text'
                        name='last' value={last}
                        label='Last Name'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                    />
                    <NativeSelects
                        range={['Male', 'Female']}
                        theLabel='Gender'
                        criteria='gender'
                        theField={gender}
                        toChange={this.handleChange}
                    />
                    <NativeSelects
                        range={['Married', 'Single']}
                        theLabel='Marital Status'
                        criteria='maritalStatus'
                        theField={maritalStatus}
                        toChange={this.handleChange}
                    />
                    <TextField
                        type='text'
                        name='cnic' value={cnic}
                        label='CNIC'
                        onChange={this.handleChange}
                        fullWidth={true}
                        variant='outlined'
                        margin='dense'
                        style={{ marginBottom: 15 }}
                        helperText={'example: 12345-1234567-8'}
                    />
                    <Button
                        variant='contained'
                        fullWidth={true}
                        children='Sign Up'
                        color='primary'
                        size='large'
                        onClick={this.onSignUpHandler}
                    /><hr />
                    <div className='ask-signup'>
                        <Typography
                            align='center'
                            children="Already have an Account ? "
                            color='textSecondary'
                        />
                        <Button
                            variant='outlined'
                            children='Sign In Now'
                            color='secondary'
                            size='medium'
                            onClick={this.gotoSignIn}
                        />
                    </div>
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
        signUp: data => dispatch(actions.signUp(data)),
        onSnackHandler: (snack, message) => dispatch(actions.onSnackHandler({ snack, message })),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);