import { combineEpics } from 'redux-observable';

import login from './login';
import product from './product';
import vendor from './vendor';
import client from './client';
import purchase from './purchase';
import sale from './sale';
import payment from './payment';
import recovery from './recovery';

export default combineEpics(
    login.signUp,
    login.signIn,
    login.signOut,
    login.isLoggedIn,

    product.productSave,
    product.getProduct,
    product.updateProduct,
    product.deleteProduct,

    vendor.vendorSave,
    vendor.getVendor,
    vendor.updateVendor,
    vendor.deleteVendor,

    client.clientSave,
    client.getClient,
    client.updateClient,
    client.deleteClient,

    purchase.purchaseSave,
    purchase.getPurchase,
    purchase.updatePurchase,
    purchase.deletePurchase,

    sale.saleSave,
    sale.getSale,
    sale.updateSale,
    sale.deleteSale,

    payment.paymentSave,
    payment.getPayment,
    payment.updatePayment,
    payment.deletePayment,

    recovery.recoverySave,
    recovery.getRecovery,
    recovery.updateRecovery,
    recovery.deleteRecovery
);