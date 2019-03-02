import types from '../constants';

const actions = {
    onCloseSnack: payload => {
        return {
            type: types.ONCLOSESNACK, payload
        }
    },
    signUp: payload => {
        return {
            type: types.SIGNUP, payload
        }
    },
    signUpAccess: payload => {
        return {
            type: types.SIGNUPACCESS, payload
        }
    },
    signIn: payload => {
        return {
            type: types.SIGNIN, payload
        }
    },
    signInSuccess: payload => {
        return {
            type: types.SIGNINSUCCESS, payload
        }
    },
    signInFailure: payload => {
        return {
            type: types.SIGNINFAILURE, payload
        }
    },
    isLoggedIn: payload => {
        return {
            type: types.ISLOGGEDIN, payload
        }
    },
    isLoggedInSuccess: payload => {
        return {
            type: types.ISLOGGEDINSUCCESS, payload
        }
    },
    isLoggedInFailure: payload => {
        return {
            type: types.ISLOGGEDINFAILURE, payload
        }
    },
};

export default actions;