import types from '../constants';

const actions = {
    signUp: payload => {
        return {
            type: types.SIGNUP, payload
        }
    },
    signUpSuccess: payload => {
        return {
            type: types.SIGNUPSUCCESS, payload
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
};

export default actions;