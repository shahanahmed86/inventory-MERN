import types from '../constants';

const initialState = {
    profile: {},
    products: {},
    
    isLoading: false,

    isSnackOpen: false,
    snackMessage: '',

    isDialogOpen: false,
    dialogMessage: '',
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
        case types.ONDIALOG: {
            return {
                ...state,
                isDialogOpen: action.payload,
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
        case types.SIGNINSUCCESS:
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
                isLoading: true,
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
        case types.PRODUCTSAVE: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.PRODUCTSAVESUCCESS: 
        case types.PRODUCTSAVEFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload
            }
        }
        case types.UPDATEPRODUCT: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.UPDATEPRODUCTSUCCESS:
        case types.UPDATEPRODUCTFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.GETPRODUCT: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.GETPRODUCTSUCCESS: {
            return {
                ...state,
                isLoading: false,
                isDialogOpen: true,
                dialogMessage: 'Products Fetch',
                products: action.payload,
            }
        }
        case types.GETPRODUCTFAILURE: {
            return {
                ...state,
                isLoading: false,
                isDialogOpen: true,
                dialogMessage: action.payload,
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