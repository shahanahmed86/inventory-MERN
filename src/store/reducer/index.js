import types from '../constants';

const initialState = {
    profile: {},
    
    isLoading: false,
    isSnackOpen: false,
    snackMessage: '',
    token: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ONCLOSESNACK: {
            return {
                ...state,
                isSnackOpen: action.payload,
                snackMessage: '',
            }
        }
        case types.SIGNUP: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.SIGNUPACCESS: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload
            }
        }
        case types.SIGNIN: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.SIGNINACCESS: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
};

export default reducer;