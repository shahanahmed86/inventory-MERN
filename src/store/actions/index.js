import types from '../constants';

const actions = {
    onSnackHandler: payload => {
        return {
            type: types.ONSNACK, payload
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
    isLoggedIn: () => {
        return {
            type: types.ISLOGGEDIN,
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