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
    signInAccess: payload => {
        return {
            type: types.SIGNINACCESS, payload
        }
    },
};

export default actions;