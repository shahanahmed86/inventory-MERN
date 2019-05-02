import types from '../constants';

const initialState = {
	profile: {},
	products: [],
	vendors: [],
	clients: [],
	purchases: [],
	sales: [],
	payments: [],

	isLoading: false,

	isSnackOpen: false,
	snackMessage: '',

	isDialogOpen: false
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
		case types.ONDIALOG: {
			return {
				...state,
				isDialogOpen: action.payload
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
				isLoading: false,
				isDialogOpen: false,
				profile: {},
				products: [],
				vendors: [],
				clients: []
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
		case types.PRODUCTSAVESUCCESS:
		case types.PRODUCTSAVEFAILURE: {
			return {
				...state,
				isLoading: false,
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
		case types.GETPRODUCTFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEPRODUCTSUCCESS:
		case types.UPDATEPRODUCTFAILURE: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.DELETEPRODUCTSUCCESS:
		case types.DELETEPRODUCTFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.VENDORSAVESUCCESS:
		case types.VENDORSAVEFAILURE: {
			return {
				...state,
				isLoading: false,
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
		case types.GETVENDORFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEVENDORSUCCESS:
		case types.UPDATEVENDORFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.DELETEVENDORSUCCESS:
		case types.DELETEVENDORFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.CLIENTSAVESUCCESS:
		case types.CLIENTSAVEFAILURE: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.GETCLIENTSUCCESS: {
			return {
				...state,
				clients: action.payload
			};
		}
		case types.GETCLIENTFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATECLIENTSUCCESS:
		case types.UPDATECLIENTFAILURE: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.DELETECLIENTSUCCESS:
		case types.DELETECLIENTFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.PURCHASESAVESUCCESS:
		case types.PURCHASESAVEFAILURE: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.GETPURCHASESUCCESS: {
			return {
				...state,
				purchases: action.payload
			};
		}
		case types.GETPURCHASEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEPURCHASESUCCESS: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEPURCHASEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.DELETEPURCHASESUCCESS:
		case types.DELETEPURCHASEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.SALESAVESUCCESS: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.SALESAVEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.GETSALESUCCESS: {
			return {
				...state,
				sales: action.payload
			};
		}
		case types.GETSALEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATESALESUCCESS: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATESALEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.DELETESALESUCCESS:
		case types.DELETESALEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.PAYMENTSAVESUCCESS: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.PAYMENTSAVEFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.GETPAYMENTSUCCESS: {
			return {
				...state,
				payments: action.payload
			};
		}
		case types.GETPAYMENTFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEPAYMENTSUCCESS: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.UPDATEPAYMENTFAILURE: {
			return {
				...state,
				isSnackOpen: true,
				snackMessage: action.payload
			};
		}
		case types.DELETEPAYMENTSUCCESS:
		case types.DELETEPAYMENTFAILURE: {
			return {
				...state,
				isLoading: false,
				isSnackOpen: true,
				snackMessage: action.payload
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
