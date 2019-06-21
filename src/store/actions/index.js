import types from '../constants';

const actions = {
	onSnackHandler: (payload) => {
		return {
			type: types.ONSNACK,
			payload
		};
	},
	onLoader: (payload) => {
		return {
			type: types.ONLOADER,
			payload
		};
	},
	signUp: (payload) => {
		return {
			type: types.SIGNUP,
			payload
		};
	},
	signUpAccess: (payload) => {
		return {
			type: types.SIGNUPACCESS,
			payload
		};
	},
	signIn: (payload) => {
		return {
			type: types.SIGNIN,
			payload
		};
	},
	signInSuccess: (payload) => {
		return {
			type: types.SIGNINSUCCESS,
			payload
		};
	},
	signInFailure: (payload) => {
		return {
			type: types.SIGNINFAILURE,
			payload
		};
	},
	signOut: () => {
		return {
			type: types.SIGNOUT
		};
	},
	signOutSuccess: () => {
		return {
			type: types.SIGNOUTSUCCESS
		};
	},
	signOutFailure: () => {
		return {
			type: types.SIGNOUTSUCCESS
		};
	},
	isLoggedIn: () => {
		return {
			type: types.ISLOGGEDIN
		};
	},
	isLoggedInSuccess: (payload) => {
		return {
			type: types.ISLOGGEDINSUCCESS,
			payload
		};
	},
	isLoggedInFailure: (payload) => {
		return {
			type: types.ISLOGGEDINFAILURE,
			payload
		};
	},
	productSave: (payload) => {
		return {
			type: types.PRODUCTSAVE,
			payload
		};
	},
	productSaveSuccess: (payload) => {
		return {
			type: types.PRODUCTSAVESUCCESS,
			payload
		};
	},
	productSaveFailure: (payload) => {
		return {
			type: types.PRODUCTSAVEFAILURE,
			payload
		};
	},
	getProduct: (payload) => {
		return {
			type: types.GETPRODUCT,
			payload
		};
	},
	getProductSuccess: (payload) => {
		return {
			type: types.GETPRODUCTSUCCESS,
			payload
		};
	},
	getProductFailure: (payload) => {
		return {
			type: types.GETPRODUCTFAILURE,
			payload
		};
	},
	updateProduct: (payload) => {
		return {
			type: types.UPDATEPRODUCT,
			payload
		};
	},
	updateProductSuccess: (payload) => {
		return {
			type: types.UPDATEPRODUCTSUCCESS,
			payload
		};
	},
	updateProductFailure: (payload) => {
		return {
			type: types.UPDATEPRODUCTFAILURE,
			payload
		};
	},
	deleteProduct: (payload) => {
		return {
			type: types.DELETEPRODUCT,
			payload
		};
	},
	deleteProductSuccess: (payload) => {
		return {
			type: types.DELETEPRODUCTSUCCESS,
			payload
		};
	},
	deleteProductFailure: (payload) => {
		return {
			type: types.DELETEPRODUCTFAILURE,
			payload
		};
	},
	vendorSave: (payload) => {
		return {
			type: types.VENDORSAVE,
			payload
		};
	},
	vendorSaveSuccess: (payload) => {
		return {
			type: types.VENDORSAVESUCCESS,
			payload
		};
	},
	vendorSaveFailure: (payload) => {
		return {
			type: types.VENDORSAVEFAILURE,
			payload
		};
	},
	getVendor: (payload) => {
		return {
			type: types.GETVENDOR,
			payload
		};
	},
	getVendorSuccess: (payload) => {
		return {
			type: types.GETVENDORSUCCESS,
			payload
		};
	},
	getVendorFailure: (payload) => {
		return {
			type: types.GETVENDORFAILURE,
			payload
		};
	},
	updateVendor: (payload) => {
		return {
			type: types.UPDATEVENDOR,
			payload
		};
	},
	updateVendorSuccess: (payload) => {
		return {
			type: types.UPDATEVENDORSUCCESS,
			payload
		};
	},
	updateVendorFailure: (payload) => {
		return {
			type: types.UPDATEVENDORFAILURE,
			payload
		};
	},
	deleteVendor: (payload) => {
		return {
			type: types.DELETEVENDOR,
			payload
		};
	},
	deleteVendorSuccess: (payload) => {
		return {
			type: types.DELETEVENDORSUCCESS,
			payload
		};
	},
	deleteVendorFailure: (payload) => {
		return {
			type: types.DELETEVENDORFAILURE,
			payload
		};
	},
	clientSave: (payload) => {
		return {
			type: types.CLIENTSAVE,
			payload
		};
	},
	clientSaveSuccess: (payload) => {
		return {
			type: types.CLIENTSAVESUCCESS,
			payload
		};
	},
	clientSaveFailure: (payload) => {
		return {
			type: types.CLIENTSAVEFAILURE,
			payload
		};
	},
	getClient: (payload) => {
		return {
			type: types.GETCLIENT,
			payload
		};
	},
	getClientSuccess: (payload) => {
		return {
			type: types.GETCLIENTSUCCESS,
			payload
		};
	},
	getClientFailure: (payload) => {
		return {
			type: types.GETCLIENTFAILURE,
			payload
		};
	},
	updateClient: (payload) => {
		return {
			type: types.UPDATECLIENT,
			payload
		};
	},
	updateClientSuccess: (payload) => {
		return {
			type: types.UPDATECLIENTSUCCESS,
			payload
		};
	},
	updateClientFailure: (payload) => {
		return {
			type: types.UPDATECLIENTFAILURE,
			payload
		};
	},
	deleteClient: (payload) => {
		return {
			type: types.DELETECLIENT,
			payload
		};
	},
	deleteClientSuccess: (payload) => {
		return {
			type: types.DELETECLIENTSUCCESS,
			payload
		};
	},
	deleteClientFailure: (payload) => {
		return {
			type: types.DELETECLIENTFAILURE,
			payload
		};
	},
	purchaseSave: (payload) => {
		return {
			type: types.PURCHASESAVE,
			payload
		};
	},
	purchaseSaveSuccess: (payload) => {
		return {
			type: types.PURCHASESAVESUCCESS,
			payload
		};
	},
	purchaseSaveFailure: (payload) => {
		return {
			type: types.PURCHASESAVEFAILURE,
			payload
		};
	},
	getPurchase: () => {
		return {
			type: types.GETPURCHASE
		};
	},
	getPurchaseSuccess: (payload) => {
		return {
			type: types.GETPURCHASESUCCESS,
			payload
		};
	},
	getPurchaseFailure: (payload) => {
		return {
			type: types.GETPURCHASEFAILURE,
			payload
		};
	},
	deletePurchase: (payload) => {
		return {
			type: types.DELETEPURCHASE,
			payload
		};
	},
	deletePurchaseSuccess: (payload) => {
		return {
			type: types.DELETEPURCHASESUCCESS,
			payload
		};
	},
	deletePurchaseFailure: (payload) => {
		return {
			type: types.DELETEPURCHASEFAILURE,
			payload
		};
	},
	updatePurchase: (payload) => {
		return {
			type: types.UPDATEPURCHASE,
			payload
		};
	},
	updatePurchaseSuccess: (payload) => {
		return {
			type: types.UPDATEPURCHASESUCCESS,
			payload
		};
	},
	updatePurchaseFailure: (payload) => {
		return {
			type: types.UPDATEPURCHASEFAILURE,
			payload
		};
	},
	saleSave: (payload) => {
		return {
			type: types.SALESAVE,
			payload
		};
	},
	saleSaveSuccess: (payload) => {
		return {
			type: types.SALESAVESUCCESS,
			payload
		};
	},
	saleSaveFailure: (payload) => {
		return {
			type: types.SALESAVEFAILURE,
			payload
		};
	},
	getSale: () => {
		return {
			type: types.GETSALE
		};
	},
	getSaleSuccess: (payload) => {
		return {
			type: types.GETSALESUCCESS,
			payload
		};
	},
	getSaleFailure: (payload) => {
		return {
			type: types.GETSALEFAILURE,
			payload
		};
	},
	updateSale: (payload) => {
		return {
			type: types.UPDATESALE,
			payload
		};
	},
	updateSaleSuccess: (payload) => {
		return {
			type: types.UPDATESALESUCCESS,
			payload
		};
	},
	updateSaleFailure: (payload) => {
		return {
			type: types.UPDATESALEFAILURE,
			payload
		};
	},
	deleteSale: (payload) => {
		return {
			type: types.DELETESALE,
			payload
		};
	},
	deleteSaleSuccess: (payload) => {
		return {
			type: types.DELETESALESUCCESS,
			payload
		};
	},
	deleteSaleFailure: (payload) => {
		return {
			type: types.DELETESALEFAILURE,
			payload
		};
	},
	paymentSave: (payload) => {
		return {
			type: types.PAYMENTSAVE,
			payload
		};
	},
	paymentSaveSuccess: (payload) => {
		return {
			type: types.PAYMENTSAVESUCCESS,
			payload
		};
	},
	paymentSaveFailure: (payload) => {
		return {
			type: types.PAYMENTSAVEFAILURE,
			payload
		};
	},
	getPayment: () => {
		return {
			type: types.GETPAYMENT
		};
	},
	getPaymentSuccess: (payload) => {
		return {
			type: types.GETPAYMENTSUCCESS,
			payload
		};
	},
	getPaymentFailure: (payload) => {
		return {
			type: types.GETPAYMENTFAILURE,
			payload
		};
	},
	updatePayment: (payload) => {
		return {
			type: types.UPDATEPAYMENT,
			payload
		};
	},
	updatePaymentSuccess: (payload) => {
		return {
			type: types.UPDATEPAYMENTSUCCESS,
			payload
		};
	},
	updatePaymentFailure: (payload) => {
		return {
			type: types.UPDATEPAYMENTFAILURE,
			payload
		};
	},
	deletePayment: (payload) => {
		return {
			type: types.DELETEPAYMENT,
			payload
		};
	},
	deletePaymentSuccess: (payload) => {
		return {
			type: types.DELETEPAYMENTSUCCESS,
			payload
		};
	},
	deletePaymentFailure: (payload) => {
		return {
			type: types.DELETEPAYMENTFAILURE,
			payload
		};
	},
	recoverySave: (payload) => {
		return {
			type: types.RECOVERYSAVE,
			payload
		};
	},
	recoverySaveSuccess: (payload) => {
		return {
			type: types.RECOVERYSAVESUCCESS,
			payload
		};
	},
	recoverySaveFailure: (payload) => {
		return {
			type: types.RECOVERYSAVEFAILURE,
			payload
		};
	},
	getRecovery: () => {
		return {
			type: types.GETRECOVERY
		};
	},
	getRecoverySuccess: (payload) => {
		return {
			type: types.GETRECOVERYSUCCESS,
			payload
		};
	},
	getRecoveryFailure: (payload) => {
		return {
			type: types.GETRECOVERYFAILURE,
			payload
		};
	},
	updateRecovery: (payload) => {
		return {
			type: types.UPDATERECOVERY,
			payload
		};
	},
	updateRecoverySuccess: (payload) => {
		return {
			type: types.UPDATERECOVERYSUCCESS,
			payload
		};
	},
	updateRecoveryFailure: (payload) => {
		return {
			type: types.UPDATERECOVERYFAILURE,
			payload
		};
	},
	deleteRecovery: (payload) => {
		return {
			type: types.DELETERECOVERY,
			payload
		};
	},
	deleteRecoverySuccess: (payload) => {
		return {
			type: types.DELETERECOVERYSUCCESS,
			payload
		};
	},
	deleteRecoveryFailure: (payload) => {
		return {
			type: types.DELETERECOVERYFAILURE,
			payload
		};
	}
};

export default actions;
