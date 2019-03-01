import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const epics = {
    signup: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        return Observable.ajax({
            method: 'POST',
            url: 'http://localhost:8080/user/signup',
            body: payload,
            async: true
        })
            .switchMap(res => Observable.of(actions.signUpAccess(res.response)))
            .catch(() => Observable.of(actions.signUpAccess('Network Error')))
    }),
    signin: action$ => action$.ofType(types.SIGNIN).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(x => Boolean(x));
        if (isMatch) return Observable.ajax({
            method: 'POST',
            url: 'http://localhost:8080/user/signin',
            body: payload,
            async: true
        })
            .switchMap(res => {
                localStorage.setItem('token', JSON.stringify(res.response));
                return Observable.of(actions.signInAccess('Signed In Successfully'));
            })
            .catch((err) => Observable.of(actions.signInAccess(err.response)));
        return Observable.of(actions.signInAccess('Fields can\'t be left empty'));
    }),
};

export default epics;