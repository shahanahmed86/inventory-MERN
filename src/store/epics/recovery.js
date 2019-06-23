import 'rxjs/Rx';
import { switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import HttpService from '../../service';

const recovery = {
	recoverySave: (action$) =>
		action$.pipe(
			ofType(types.RECOVERYSAVE),
			switchMap(({ payload }) => {
				const isFilled = [];
				payload.details.forEach((x) => {
					isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
				});
				isFilled.push(Object.values(payload).every((val) => Boolean(val)));
				if (isFilled.every((val) => Boolean(val))) {
					return HttpService.post(`https://inventory-app-mern.herokuapp.com/recovery`, `POST`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.recoverySaveSuccess(resp.response))
									: Observable.of(actions.recoverySaveFailure('Something went wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.recoverySaveFailure(err.response))
									: Observable.of(actions.recoverySaveFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.recoverySaveFailure('All fields are required'));
				}
			})
		),
	getRecovery: (action$) =>
		action$.pipe(
			ofType(types.GETRECOVERY),
			switchMap(() => {
				return HttpService.get(`https://inventory-app-mern.herokuapp.com/recovery`, `GET`).pipe(
					switchMap(
						(resp) =>
							resp.response.length
								? Observable.of(actions.getRecoverySuccess(resp.response))
								: Observable.of(actions.getRecoverySuccess([]))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.getRecoveryFailure(err.response))
								: Observable.of(actions.getRecoveryFailure('Network Error'))
					)
				);
			})
		),
	updateRecovery: (action$) =>
		action$.pipe(
			ofType(types.UPDATERECOVERY),
			switchMap(({ payload }) => {
				const isFilled = [];
				payload.details.forEach((x) => {
					isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
				});
				isFilled.push(Object.values(payload).every((val) => Boolean(val)));
				if (isFilled.every((val) => Boolean(val))) {
					return HttpService.put(
						`https://inventory-app-mern.herokuapp.com/recovery/${payload._id}`,
						`PUT`,
						payload
					).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(
											actions.onLoader(true),
											actions.updateRecoverySuccess(resp.response)
										)
									: Observable.of(actions.updateRecoveryFailure('something wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.updateRecoveryFailure(err.response))
									: Observable.of(actions.updateRecoveryFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.updateRecoveryFailure('All Fields are Required'));
				}
			})
		),
	deleteRecovery: (action$) =>
		action$.pipe(
			ofType(types.DELETERECOVERY),
			switchMap(({ payload }) => {
				return HttpService.delete(
					`https://inventory-app-mern.herokuapp.com/recovery/${payload}`,
					`DELETE`
				).pipe(
					switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.deleteRecoverySuccess(resp.response))
								: Observable.of(actions.deleteRecoveryFailure('something wrong'))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.deleteRecoveryFailure(err.response))
								: Observable.of(actions.deleteRecoveryFailure('Network Error'))
					)
				);
			})
		)
};

export default recovery;
