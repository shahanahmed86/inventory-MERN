import types from '../constants';

const actions = {
    onSnackHandler: payload => {
        return {
            type: types.ONSNACK, payload
        }
    },
    onDialog: payload => {
        return {
            type: types.ONDIALOG, payload
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
    productSave: payload => {
        return {
            type: types.PRODUCTSAVE, payload
        }
    },
    productSaveSuccess: payload => {
        return {
            type: types.PRODUCTSAVESUCCESS, payload
        }
    },
    productSaveFailure: payload => {
        return {
            type: types.PRODUCTSAVEFAILURE, payload
        }
    },
    updateProduct: payload => {
        return {
            type: types.UPDATEPRODUCT, payload
        }
    },
    updateProductSuccess: payload => {
        return {
            type: types.UPDATEPRODUCTSUCCESS, payload
        }
    },
    updateProductFailure: payload => {
        return {
            type: types.UPDATEPRODUCTFAILURE, payload
        }
    },
    getProduct: payload => {
        return {
            type: types.GETPRODUCT, payload
        }
    },
    getProductSuccess: payload => {
        return {
            type: types.GETPRODUCTSUCCESS, payload
        }
    },
    getProductFailure: payload => {
        return {
            type: types.GETPRODUCTFAILURE, payload
        }
    },
    deleteProduct: payload => {
        return {
            type: types.DELETEPRODUCT, payload
        }
    },
    deleteProductSuccess: payload => {
        return {
            type: types.DELETEPRODUCTSUCCESS, payload
        }
    },
    deleteProductFailure: payload => {
        return {
            type: types.DELETEPRODUCTFAILURE, payload
        }
    },
};

export default actions;