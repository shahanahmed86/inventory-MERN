// import axios from 'axios';
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
};

export default actions;