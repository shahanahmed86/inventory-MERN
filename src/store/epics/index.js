import { combineEpics } from 'redux-observable';

import epics from './epics';

export default combineEpics(
    epics.signUp,
    epics.signIn,
    epics.isLoggedIn,
    epics.productSave,
    epics.getProduct,
);