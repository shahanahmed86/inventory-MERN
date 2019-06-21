import types from '../constants';

const initialState = {
	profile: {},
	products: [],
	vendors: [],
	clients: [],
	purchases: [],
	sales: [],
	payments: [],
	recoveries: [],

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
				snackMessage: action.payload.message
			};
		}
		case types.ONLOADER: {
			return {
				...state,
				isLoading: action.payload
			};
		}
		case types.SIGNOUT: {
			return {
				...state,
				isLoading: true
			};
		}
		case types.SIGNOUTSUCCESS:
		case types.SIGNOUTFAILURE: {
			return {
				...state,
				profile: {},
				products: [],
				vendors: [],
				clients: [],
				purchases: [],
				sales: [],
				payments: [],
				recoveries: [],
				isLoading: false
			};
		}
		case types.ISLOGGEDIN: {
			return {
				...state,
				isLoading: true
			};
		}
		case types.ISLOGGEDINSUCCESS: {
			return {
				...state,
				isLoading: false,
				profile: action.payload
			};
		}
		case types.ISLOGGEDINFAILURE: {
			return {
				...state,
				isLoading: false
			};
		}
		case types.UPDATEVENDORSUCCESS:
		case types.DELETEVENDORSUCCESS:
		case types.VENDORSAVESUCCESS:
		case types.UPDATEPRODUCTSUCCESS:
		case types.DELETEPRODUCTSUCCESS:
		case types.PRODUCTSAVESUCCESS:
		case types.CLIENTSAVESUCCESS:
		case types.UPDATECLIENTSUCCESS:
		case types.DELETECLIENTSUCCESS:
		case types.PURCHASESAVESUCCESS:
		case types.UPDATEPURCHASESUCCESS:
		case types.DELETEPURCHASESUCCESS:
		case types.SALESAVESUCCESS:
		case types.UPDATESALESUCCESS:
		case types.DELETESALESUCCESS:
		case types.PAYMENTSAVESUCCESS:
		case types.UPDATEPAYMENTSUCCESS:
		case types.DELETEPAYMENTSUCCESS:
		case types.RECOVERYSAVESUCCESS:
		case types.UPDATERECOVERYSUCCESS:
		case types.DELETERECOVERYSUCCESS: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEVENDORFAILURE:
		case types.DELETEVENDORFAILURE:
		case types.VENDORSAVEFAILURE:
		case types.UPDATEPRODUCTFAILURE:
		case types.DELETEPRODUCTFAILURE:
		case types.PRODUCTSAVEFAILURE:
		case types.CLIENTSAVEFAILURE:
		case types.UPDATECLIENTFAILURE:
		case types.DELETECLIENTFAILURE:
		case types.PURCHASESAVEFAILURE:
		case types.UPDATEPURCHASEFAILURE:
		case types.DELETEPURCHASEFAILURE:
		case types.SALESAVEFAILURE:
		case types.UPDATESALEFAILURE:
		case types.DELETESALEFAILURE:
		case types.PAYMENTSAVEFAILURE:
		case types.UPDATEPAYMENTFAILURE:
		case types.DELETEPAYMENTFAILURE:
		case types.RECOVERYSAVEFAILURE:
		case types.UPDATERECOVERYFAILURE:
		case types.DELETERECOVERYFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.GETPRODUCTSUCCESS: {
			return {
				...state,
				products: action.payload
			};
		}
		case types.GETPRODUCTFAILURE:
		case types.GETVENDORFAILURE:
		case types.GETCLIENTFAILURE:
		case types.GETPURCHASEFAILURE:
		case types.GETSALEFAILURE:
		case types.GETPAYMENTFAILURE:
		case types.GETRECOVERYFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.GETVENDORSUCCESS: {
			return {
				...state,
				vendors: action.payload
			};
		}
		case types.GETCLIENTSUCCESS: {
			return {
				...state,
				clients: action.payload
			};
		}
		case types.GETPURCHASESUCCESS: {
			return {
				...state,
				purchases: action.payload
			};
		}
		case types.GETSALESUCCESS: {
			return {
				...state,
				sales: action.payload
			};
		}
		case types.GETPAYMENTSUCCESS: {
			return {
				...state,
				payments: action.payload
			};
		}
		case types.GETRECOVERYSUCCESS: {
			return {
				...state,
				recoveries: action.payload
			};
		}
		default: {
			return {
				...state
			};
		}
	}
};

export default reducer;
