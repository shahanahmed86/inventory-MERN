import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const purchase = {
    purchaseSave: action$ => action$.ofType(types.PURCHASESAVE).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: 'http://localhost:8080/purchase',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.purchaseSaveSuccess(resp.response));
            return Observable.of(actions.purchaseSaveFailure('Something went wrong'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.purchaseSaveFailure(err.response));
            return Observable.of(actions.purchaseSaveFailure('Network Error'));
        });
        return Observable.of(actions.purchaseSaveFailure('All fields are required'));
    }),
}

export default purchase;