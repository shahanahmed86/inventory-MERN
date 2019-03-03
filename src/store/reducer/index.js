import types from '../constants';

const initialState = {
    profile: {},
    
    isLoading: false,

    isSnackOpen: false,
    snackMessage: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.ONSNACK: {
            return {
                ...state,
                isSnackOpen: action.payload.snack,
                snackMessage: action.payload.message,
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
        case types.SIGNINSUCCESS: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.SIGNINFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.ISLOGGEDIN: {
            return {
                ...state,
                // isLoading: true,
            }
        }
        case types.ISLOGGEDINSUCCESS: {
            return {
                ...state,
                isLoading: false,
                profile: action.payload,
            }
        }
        case types.ISLOGGEDINFAILURE: {
            return {
                ...state,
                isLoading: false,
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