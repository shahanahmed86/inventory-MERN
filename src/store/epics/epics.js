import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const epics = {
    signup: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        return Observable.of(
            actions.signUpSuccess(payload)
        );
    }),
};

export default epics;