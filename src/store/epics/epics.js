import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const epics = {
    signUp: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        return Observable.ajax({
            url: 'http://localhost:8080/user/signup',
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            },
            async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
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
            url: 'http://localhost:8080/user/signin',
            method: 'POST',
            body: payload,
            headers: {
                'Content-Type': 'application/json'
            },
            async: true,
            crossDomain: true,
            responseType: 'json',
            createXHR: () => new XMLHttpRequest()
        }).switchMap(res => {
            return Observable.of(actions.signInSuccess(res.response));
        }).catch(err => {
            if (err.response) return Observable.of(actions.signInFailure(err.response));
            return Observable.of(actions.signInFailure('Network Error'));
        });
        return Observable.of(actions.signInFailure('Please Enter Email & Password, in order to login'));
    }),
    isLoggedIn: action$ => action$.ofType(types.ISLOGGEDIN).switchMap(() => {
        //payload is cookie
        return Observable.ajax({
            url: 'http://localhost:8080/user',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            async: true,
            crossDomain: true,
            responseType: 'json',
            withCredentials: true,
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