import React, { Component } from 'react';
import {
    Paper, Typography, TextField,
    Button
} from '@material-ui/core';
import { connect } from 'react-redux';

import actions from '../store/actions';
import '../App.css';

class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            email: 'shahan@domain.com',
            password: '123abc456',
        }
    }
    componentDidMount() {
        if (this.props.store.profile.email) return this.props.history.push('/dashboard');
        return this.props.history.push('/');
    }
    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value
        });
    }
    onSignInHandler = () => {
        const { email, password } = this.state;
        this.props.signIn({ email, password });
    }
    gotoSignUp = () => {
        this.props.history.push('/signup');
    }
    render() {
        const { email, password } = this.state;
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
                        Sign In
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
                    <Button
                        variant='contained'
                        fullWidth={true}
                        children='Sign In'
                        color='primary'
                        size='large'
                        onClick={this.onSignInHandler}
                    /><hr />
                    <div className='ask-signup'>
                        <Typography
                            align='center'
                            children="Don't have an Account ? "
                            color='textSecondary'
                        />
                        <Button
                            variant='outlined'
                            children='Create Account Now'
                            color='secondary'
                            size='medium'
                            onClick={this.gotoSignUp}
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
        signIn: (email, password) => dispatch(actions.signIn(email, password)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);