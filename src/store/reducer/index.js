import types from '../constants';

const initialState = {
    profile: {},
    products: [],
    vendors: [],
    clients: [],
    purchases: [],
    
    isLoading: false,

    isSnackOpen: false,
    snackMessage: '',

    isDialogOpen: false,
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
        case types.SIGNOUT: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.SIGNOUTSUCCESS:
        case types.SIGNOUTFAILURE: {
            return {
                ...state,
                isLoading: false,
                isDialogOpen: false,
                isSnackOpen: true,
                snackMessage: action.payload,
                profile: {},
                products: [],
                vendors: [],
                clients: [],
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
        case types.GETPRODUCTSUCCESS: {
            return {
                ...state,
                isDialogOpen: true,
                products: action.payload,
            }
        }
        case types.GETPRODUCTFAILURE: {
            return {
                ...state,
                isSnackOpen: true,
                snackMessage: action.payload,
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
        case types.DELETEPRODUCTSUCCESS: 
        case types.DELETEPRODUCTFAILURE: {
            return {
                ...state,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.VENDORSAVE: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.VENDORSAVESUCCESS: 
        case types.VENDORSAVEFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload
            }
        }
        case types.GETVENDORSUCCESS: {
            return {
                ...state,
                isDialogOpen: true,
                vendors: action.payload,
            }
        }
        case types.GETVENDORFAILURE: {
            return {
                ...state,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.UPDATEVENDOR: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.UPDATEVENDORSUCCESS:
        case types.UPDATEVENDORFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.DELETEVENDORSUCCESS: 
        case types.DELETEVENDORFAILURE: {
            return {
                ...state,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.CLIENTSAVE: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.CLIENTSAVESUCCESS: 
        case types.CLIENTSAVEFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload
            }
        }
        case types.GETCLIENTSUCCESS: {
            return {
                ...state,
                isDialogOpen: true,
                clients: action.payload,
            }
        }
        case types.GETCLIENTFAILURE: {
            return {
                ...state,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.UPDATECLIENT: {
            return {
                ...state,
                isLoading: true,
            }
        }
        case types.UPDATECLIENTSUCCESS:
        case types.UPDATECLIENTFAILURE: {
            return {
                ...state,
                isLoading: false,
                isSnackOpen: true,
                snackMessage: action.payload,
            }
        }
        case types.DELETECLIENTSUCCESS: 
        case types.DELETECLIENTFAILURE: {
            return {
                ...state,
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