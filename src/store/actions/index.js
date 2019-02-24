import types from '../constants';

const actions = {
    signUp: payload => ({
        type: types.SIGNUP, payload
    }),
    signUpSuccess: payload => ({
        type: types.SIGNUPSUCCESS, payload
    }),
};

export default actions;