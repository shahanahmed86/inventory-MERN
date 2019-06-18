import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const recovery = {
	recoverySave: (action$) =>
		action$.ofType(types.RECOVERYSAVE).switchMap(({ payload }) => {
			const isFilled = [];
			payload.details.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
			});
			isFilled.push(Object.values(payload).every((val) => Boolean(val)));
			if (isFilled.every((val) => Boolean(val)))
				return Observable.ajax({
					url: 'http://localhost:8080/recovery',
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
						if (typeof resp.response === 'string')
							return Observable.of(actions.onLoader(true), actions.recoverySaveSuccess(resp.response));
						return Observable.of(actions.recoverySaveFailure('Something went wrong'));
					})
					.catch((err) => {
						if (typeof err.response === 'string')
							return Observable.of(actions.recoverySaveFailure(err.response));
						return Observable.of(actions.recoverySaveFailure('Network Error'));
					});
			return Observable.of(actions.recoverySaveFailure('All fields are required'));
		}),
	getRecovery: (action$) =>
		action$.ofType(types.GETRECOVERY).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/recovery',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response.length) return Observable.of(actions.getRecoverySuccess(resp.response));
					return Observable.of(actions.getRecoverySuccess([]));
				})
				.catch((err) => {
					if (err.response) return Observable.of(actions.getRecoveryFailure(err.response));
					return Observable.of(actions.getRecoveryFailure('Network Error'));
				});
		}),
	updateRecovery: (action$) =>
		action$.ofType(types.UPDATERECOVERY).switchMap(({ payload }) => {
			const isFilled = [];
			payload.details.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
			});
			isFilled.push(Object.values(payload).every((val) => Boolean(val)));
			if (isFilled.every((val) => Boolean(val)))
				return Observable.ajax({
					url: `http://localhost:8080/recovery/${payload._id}`,
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: payload,
					async: true,
					crossDomain: true,
					withCredentials: true,
					createXHR: () => new XMLHttpRequest(),
					responseType: 'json'
				}).switchMap((resp) => {
					if (typeof resp.response === 'string')
						return Observable.of(actions.onLoader(true), actions.updateRecoverySuccess(resp.response));
					return Observable.of(actions.updateRecoveryFailure('something wrong'));
				});
			return Observable.of(actions.updateRecoveryFailure('All Fields are Required'));
		}),
	deleteRecovery: (action$) =>
		action$.ofType(types.DELETERECOVERY).switchMap(({ payload }) => {
			return Observable.ajax({
				url: `http://localhost:8080/recovery/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			}).switchMap((resp) => {
				if (typeof resp.response === 'string')
					return Observable.of(actions.deleteRecoverySuccess(resp.response));
				return Observable.of(actions.deleteRecoveryFailure('something wrong'));
			});
		})
};

export default recovery;
