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
    signOut: action$ => action$.ofType(types.SIGNOUT).switchMap(() => {
        return Observable.ajax({
            url: 'http://localhost:8080/user/logout',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(res => {
            if (res.response) return Observable.of(
                actions.signOutSuccess(res.response),
            );
            return Observable.of(actions.signOutFailure('Something went wrong'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.signOutFailure(err.response));
            return Observable.of(actions.signOutFailure('Network Error'));
        });
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
            url: 'http://localhost:8080/product',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.productSaveSuccess(resp.response));
            return Observable.of(actions.productSaveFailure('Something went wrong'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.productSaveFailure(err.response));
            return Observable.of(actions.productSaveFailure('Network Error'));
        });
        return Observable.of(actions.productSaveFailure('All fields are required'));
    }),
    getProduct: action$ => action$.ofType(types.GETPRODUCT).switchMap(() => {
        return Observable.ajax({
            url: 'http://localhost:8080/product',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json'
        }).switchMap(resp => {
            if (resp.response.products.length) {
                return Observable.of(actions.getProductSuccess(resp.response.products));
            } else {
                return Observable.of(
                    actions.getProductSuccess([]),
                    actions.onDialog(false),
                    actions.onSnackHandler({ snack: true, message: 'Product Data is empty' }),
                );
            }
        }).catch(err => {
            if (err.response) return Observable.of(actions.getProductFailure(err.response));
            return Observable.of(actions.getProductFailure('Network Error'));
        });
    }),
    updateProduct: action$ => action$.ofType(types.UPDATEPRODUCT).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).entries(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: `http://localhost:8080/product/${payload._id}`,
            method: 'PUT',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.updateProductSuccess(resp.response));
            return Observable.of(actions.updateProductFailure('Something went Wrong'));
        }).catch(() => {
            return Observable.of(actions.updateProductFailure('Network Failure'));
        });
        return Observable.of(actions.updateProductFailure('All fields are required'));
    }),
    deleteProduct: action$ => action$.ofType(types.DELETEPRODUCT).switchMap(({ payload }) => {
        return Observable.ajax({
            url: `http://localhost:8080/product/${payload}`,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(
                actions.deleteProductSuccess(resp.response),
                actions.getProduct(),
            );
            return Observable.of(actions.deleteProductFailure('Something went Wrong'));
        }).catch(() => {
            return Observable.of(actions.deleteProductFailure('Network Failure'));
        });
    }),
    vendorSave: action$ => action$.ofType(types.VENDORSAVE).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: 'http://localhost:8080/vendor',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.vendorSaveSuccess(resp.response));
            return Observable.of(actions.vendorSaveFailure('Something went wrong'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.vendorSaveFailure(err.response));
            return Observable.of(actions.vendorSaveFailure('Network Error'));
        });
        return Observable.of(actions.vendorSaveFailure('All fields are required'));
    }),
    getVendor: action$ => action$.ofType(types.GETVENDOR).switchMap(() => {
        return Observable.ajax({
            url: 'http://localhost:8080/vendor',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json'
        }).switchMap(resp => {
            if (resp.response.vendors.length) {
                return Observable.of(actions.getVendorSuccess(resp.response.vendors));
            } else {
                return Observable.of(
                    actions.getVendorSuccess([]),
                    actions.onDialog(false),
                    actions.onSnackHandler({ snack: true, message: 'Vendor Data is empty' }),
                );
            }
        }).catch(err => {
            if (err.response) return Observable.of(actions.getVendorFailure(err.response));
            return Observable.of(actions.getVendorFailure('Network Error'));
        });
    }),
    updateVendor: action$ => action$.ofType(types.UPDATEVENDOR).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).entries(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: `http://localhost:8080/vendor/${payload._id}`,
            method: 'PUT',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.updateVendorSuccess(resp.response));
            return Observable.of(actions.updateVendorFailure('Something went Wrong'));
        }).catch(() => {
            return Observable.of(actions.updateVendorFailure('Network Failure'));
        });
        return Observable.of(actions.updateVendorFailure('All fields are required'));
    }),
    deleteVendor: action$ => action$.ofType(types.DELETEVENDOR).switchMap(({ payload }) => {
        return Observable.ajax({
            url: `http://localhost:8080/vendor/${payload}`,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(
                actions.deleteVendorSuccess(resp.response),
                actions.getVendor(),
            );
            return Observable.of(actions.deleteVendorFailure('Something went Wrong'));
        }).catch(() => {
            return Observable.of(actions.deleteVendorFailure('Network Failure'));
        });
    }),
    clientSave: action$ => action$.ofType(types.CLIENTSAVE).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).every(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: 'http://localhost:8080/client',
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.clientSaveSuccess(resp.response));
            return Observable.of(actions.clientSaveFailure('Something went wrong'));
        }).catch(err => {
            if (err.response) return Observable.of(actions.clientSaveFailure(err.response));
            return Observable.of(actions.clientSaveFailure('Network Error'));
        });
        return Observable.of(actions.clientSaveFailure('All fields are required'));
    }),
    getClient: action$ => action$.ofType(types.GETCLIENT).switchMap(() => {
        return Observable.ajax({
            url: 'http://localhost:8080/client',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json'
        }).switchMap(resp => {
            if (resp.response.clients.length) {
                return Observable.of(actions.getClientSuccess(resp.response.clients));
            } else {
                return Observable.of(
                    actions.getClientSuccess([]),
                    actions.onDialog(false),
                    actions.onSnackHandler({ snack: true, message: 'Client Data is empty' }),
                );
            }
        }).catch(err => {
            if (err.response) return Observable.of(actions.getClientFailure(err.response));
            return Observable.of(actions.getClientFailure('Network Error'));
        });
    }),
    updateClient: action$ => action$.ofType(types.UPDATECLIENT).switchMap(({ payload }) => {
        const isMatch = Object.values(payload).entries(val => Boolean(val));
        if (isMatch) return Observable.ajax({
            url: `http://localhost:8080/client/${payload._id}`,
            method: 'PUT',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(actions.updateClientSuccess(resp.response));
            return Observable.of(actions.updateClientFailure('Something went Wrong'));
        }).catch(() => {
            return Observable.of(actions.updateClientFailure('Network Failure'));
        });
        return Observable.of(actions.updateClientFailure('All fields are required'));
    }),
    deleteClient: action$ => action$.ofType(types.DELETECLIENT).switchMap(({ payload }) => {
        return Observable.ajax({
            url: `http://localhost:8080/client/${payload}`,
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            async: true,
            crossDomain: true,
            withCredentials: true,
            createXHR: () => new XMLHttpRequest(),
            responseType: 'json',
        }).switchMap(resp => {
            if (resp.response) return Observable.of(
                actions.deleteClientSuccess(resp.response),
                actions.getClient(),
            );
            return Observable.of(actions.deleteClientFailure('Something went Wrong'));
        }).catch(() => {
            return Observable.of(actions.deleteClientFailure('Network Failure'));
        });
    }),
};

export default epics;