import React, { Component } from 'react';
import {
    Paper, Typography, TextField,
    Button
} from '@material-ui/core';

import '../App.css';

class SignIn extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
        }
    }
    handleChange = ev => {
        const { name, value } = ev.target;
        this.setState({
            [name]: value
        });
    }
    onSignIn = () => {
        this.props.history.push('/dashboard');
    }
    forgotPassword = () => {
        this.props.history.push('/forgot');
    }
    onSignUp = () => {
        this.props.history.push('/signup');
    }
    render() {
        const { email, password } = this.state;
        return(
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
                        onClick={this.onSignIn}
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
                            onClick={this.onSignUp}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default SignIn