import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const epics = {
    signUp: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        return Observable.ajax({
            url: 'http://localhost:8080/user/signup',
            body: payload,
            async: true,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            crossDomain: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(res => {
            return Observable.of(actions.signUpAccess(res.response));
        }).catch(err => {
            if (err.response) return Observable.of(actions.signUpAccess(err.response));
            return Observable.of(actions.signUpAccess('Network Error'))
        });
    }),
    signIn: action$ => action$.ofType(types.SIGNIN).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(x => Boolean(x));
        if (isMatch) return Observable.ajax({
            url: 'http://localhost:8080/user/signin',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(res => {
            return Observable.of(
                actions.signInSuccess(res.response),
                actions.isLoggedIn()
            );
        }).catch(err => {
            if (err.response) return Observable.of(actions.signInFailure(err.response));
            return Observable.of(actions.signInFailure('Network Error'));
        });
        return Observable.of(actions.signInFailure('Please Enter Email & Password, in order to login'));
    }),
    isLoggedIn: action$ => action$.ofType(types.ISLOGGEDIN).switchMap(() => {
        return Observable.ajax({
            url: 'http://localhost:8080/user',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(res => {
            if (res.response.doc) return Observable.of(actions.isLoggedInSuccess(res.response.doc));
            return Observable.of(actions.isLoggedInFailure('Token Expired'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.isLoggedInFailure(err.response));
            return Observable.of(actions.isLoggedInFailure('Network Error'));
        })
    }),
    productSave: action$ => action$.ofType(types.PRODUCTSAVE).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: 'http://localhost:8080/product/save',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(() => {
            return Observable.of(actions.productSaveSuccess('Product Saved Successfully'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.productSaveFailure(err.response));
            return Observable.of(actions.productSaveFailure('Network Error'));
        });
        return Observable.of(actions.productSaveFailure('All fields are required'));
    }),
};

export default epics;