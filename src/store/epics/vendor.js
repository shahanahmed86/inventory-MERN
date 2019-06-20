import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import store from '../index';

const vendor = {
	vendorSave: (action$) =>
		action$.ofType(types.VENDORSAVE).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: 'http://localhost:8080/vendor',
					method: 'POST',
					body: payload,
					headers: { 'Content-Type': 'application/json' },
					async: true,
					crossDomain: true,
					withCredentials: true,
					createXHR: () => new XMLHttpRequest(),
					responseType: 'json'
				})
					.switchMap((resp) => {
						if (resp.response)
							return Observable.of(actions.onLoader(true), actions.vendorSaveSuccess(resp.response));
						return Observable.of(actions.vendorSaveFailure('Something went wrong'));
					})
					.catch(() => Observable.of(actions.vendorSaveFailure('Network Error')));
			return Observable.of(actions.vendorSaveFailure('All fields are required'));
		}),
	getVendor: (action$) =>
		action$.ofType(types.GETVENDOR).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/vendor',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response.vendors.length) {
						return Observable.of(actions.getVendorSuccess(resp.response.vendors));
					} else {
						return Observable.of(actions.getVendorSuccess([]));
					}
				})
				.catch(() => Observable.of(actions.getVendorFailure('Network Error')));
		}),
	updateVendor: (action$) =>
		action$.ofType(types.UPDATEVENDOR).switchMap(({ payload }) => {
			const { purchases } = store.getState();
			const vendorRecordFound = purchases.some((x) => x.vendorId._id === payload._id);
			if (vendorRecordFound)
				return Observable.of(
					actions.updateVendorFailure("Transaction found for this vendor you can't edit it")
				);
			const isMatch = Object.values(payload).entries((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: `http://localhost:8080/vendor/${payload._id}`,
					method: 'PUT',
					body: payload,
					headers: { 'Content-Type': 'application/json' },
					async: true,
					crossDomain: true,
					withCredentials: true,
					createXHR: () => new XMLHttpRequest(),
					responseType: 'json'
				})
					.switchMap((resp) => {
						if (resp.response)
							return Observable.of(actions.onLoader(true), actions.updateVendorSuccess(resp.response));
						return Observable.of(actions.updateVendorFailure('Something went Wrong'));
					})
					.catch(() => Observable.of(actions.updateVendorFailure('Network Error')));
			return Observable.of(actions.updateVendorFailure('All fields are required'));
		}),
	deleteVendor: (action$) =>
		action$.ofType(types.DELETEVENDOR).switchMap(({ payload }) => {
			const { purchases } = store.getState();
			const vendorRecordFound = purchases.some((x) => x.vendorId._id === payload);
			if (vendorRecordFound)
				return Observable.of(
					actions.updateVendorFailure("Transaction found for this vendor you can't delete it")
				);
			return Observable.ajax({
				url: `http://localhost:8080/vendor/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response) return Observable.of(actions.deleteVendorSuccess(resp.response));
					return Observable.of(actions.deleteVendorFailure('Something went Wrong'));
				})
				.catch(() => Observable.of(actions.deleteVendorFailure('Network Error')));
		})
};

export default vendor;
