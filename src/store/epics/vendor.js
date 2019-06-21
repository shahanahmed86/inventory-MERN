import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import store from '../index';

const checkEntries = (id, book, text) => {
	const { purchases } = store.getState();
	return {
		condition: purchases.some((x) => x.vendorId._id === id),
		message: `Transaction found for this ${book} you can't ${text} it`
	}
}

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
					.switchMap(
						(resp) => typeof resp.response === 'string' ? (
							Observable.of(actions.onLoader(true), actions.vendorSaveSuccess(resp.response))
						) : (
								Observable.of(actions.vendorSaveFailure('Something went wrong'))
							)
					)
					.catch(
						(err) => typeof err.response === 'string' ? (
							Observable.of(actions.vendorSaveFailure(err.response))
						) : (
								Observable.of(actions.vendorSaveFailure('Network Error'))
							)
					);
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
				.switchMap(
					(resp) => resp.response.vendors.length ? (
						Observable.of(actions.getVendorSuccess(resp.response.vendors))
					) : (
							Observable.of(actions.getVendorFailure('Something went wrong'))

						)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(actions.getVendorFailure(err.response))
					) : (
							Observable.of(actions.getVendorFailure('Network Error'))
						)
				);
		}),
	updateVendor: (action$) =>
		action$.ofType(types.UPDATEVENDOR).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload._id, 'Vendor', 'Edit');
			if (checkTransaction.condition) {
				return Observable.of(
					actions.updateVendorFailure(checkTransaction.message)
				);
			}
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
					.switchMap(
						(resp) => typeof resp.response === 'string' ? (
							Observable.of(actions.onLoader(true), actions.updateVendorSuccess(resp.response))
						) : (
								Observable.of(actions.updateVendorFailure('Something went Wrong'))
							)
					)
					.catch(
						(err) => typeof err.response === 'string' ? (
							Observable.of(actions.updateVendorFailure(err.response))
						) : (
								Observable.of(actions.updateVendorFailure('Network Error'))
							)
					);
			return Observable.of(actions.updateVendorFailure('All fields are required'));
		}),
	deleteVendor: (action$) =>
		action$.ofType(types.DELETEVENDOR).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload, 'Vendor', 'Delete');
			if (checkTransaction.condition) {
				return Observable.of(
					actions.deleteVendorFailure(checkTransaction.message)
				);
			}
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
				.switchMap(
					(resp) => typeof resp.response === 'string' ? (
						Observable.of(actions.deleteVendorSuccess(resp.response))
					) : (
							Observable.of(actions.deleteVendorFailure('Something went Wrong'))
						)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(actions.deleteVendorFailure(err.response))
					) : (
							Observable.of(actions.deleteVendorFailure('Network Error'))
						)
				);
		})
};

export default vendor;