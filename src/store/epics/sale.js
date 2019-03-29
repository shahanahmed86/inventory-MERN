import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const sale = {
    saleSave: action$ => action$.ofType(types.SALESAVE).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: 'http://localhost:8080/sale',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(
                actions.saleSaveSuccess(resp.response),
                actions.onLoader(true),
                actions.onLoader(false),
            );
            return Observable.of(actions.saleSaveFailure('Something went wrong'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.saleSaveFailure(err.response));
            return Observable.of(actions.saleSaveFailure('Network Error'));
        });
        return Observable.of(actions.saleSaveFailure('All fields are required'));
    }),
    getSale: action$ => action$.ofType(types.GETSALE).switchMap(() => {
        return Observable.ajax({
            url: 'http://localhost:8080/sale',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json'
        }).switchMap(resp => {
            if (resp.response.length) {
                return Observable.of(actions.getsaleSuccess(resp.response));
            } else {
                return Observable.of(
                    actions.getSaleSuccess([]),
                    actions.onDialog(false),
                    actions.onSnackHandler({ snack: true, message: 'Sale Book is empty' }),
                );
            }
        }).catch(err => {
            if (err.response) return Observable.of(actions.getSaleFailure(err.response));
            return Observable.of(actions.getSaleFailure('Network Error'));
        });
    }),
}

export default sale;