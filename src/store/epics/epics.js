import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const epics = {
    signUp: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        return Observable.ajax({
            method: 'POST',
            url: 'http://localhost:8080/user/signup',
            body: payload,
            async: true
        }).switchMap(res => {
            return Observable.of(actions.signUpAccess(res.response));
        }).catch(err => {
            //below line should be check
            if (err.response) return Observable.of(actions.signUpAccess(err.response));
            return Observable.of(actions.signUpAccess('Network Error'))
        });
    }),
    signIn: action$ => action$.ofType(types.SIGNIN).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(x => Boolean(x) === true);
        if (isMatch) return Observable.ajax({
            method: 'POST',
            url: 'http://localhost:8080/user/signin',
            body: payload,
            async: true
        }).switchMap(res => {
            document.cookie = res.response.token;
            return Observable.of(actions.signInSuccess('Signed In Successfully'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.signInFailure(err.response));
            return Observable.of(actions.signInFailure('Network Error'));
        });
        return Observable.of(actions.signInFailure('Fields can\'t be left empty'));
    }),
    isLoggedIn: action$ => action$.ofType(types.ISLOGGEDIN).switchMap(({ payload }) => {
        //payload is cookie
        return Observable.ajax({
            method: 'POST',
            url: 'http://localhost:8080/user',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${payload}`
            },
            async: true
        }).switchMap(res => {
            if (res.response.doc) return Observable.of(actions.isLoggedInSuccess(res.response.doc));
            return Observable.of(actions.isLoggedInFailure('Token Expired'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.isLoggedInFailure(err.response));
            return Observable.of(actions.isLoggedInFailure('Network Error'));
        })
    }),
};

export default epics;