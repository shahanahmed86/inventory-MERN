import { combineEpics } from 'redux-observable';

import epics from './epics';
import purchase from './purchase';

export default combineEpics(
    epics.signUp,

    epics.signIn,
    
    epics.signOut,

    epics.isLoggedIn,

    epics.productSave,
    epics.getProduct,
    epics.updateProduct,
    epics.deleteProduct,

    epics.vendorSave,
    epics.getVendor,
    epics.updateVendor,
    epics.deleteVendor,

    epics.clientSave,
    epics.getClient,
    epics.updateClient,
    epics.deleteClient,

    purchase.purchaseSave,
    // purchase.getClient,
    // purchase.updateClient,
    // purchase.deleteClient,
);