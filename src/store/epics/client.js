import 'rxjs/Rx';
import { switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs/Rx';

import types from '../constants';
import actions from '../actions';
import store from '../index';
import HttpService from '../../service';

const checkEntries = (id, book, text) => {
	const { sales } = store.getState();
	return {
		condition: sales.some((x) => x.clientId._id === id),
		message: `Transaction found for this ${book} you can't ${text} it`
	};
};

const client = {
	clientSave: (action$) =>
		action$.pipe(
			ofType(types.CLIENTSAVE),
			switchMap(({ payload }) => {
				const isMatch = Object.values(payload).every((val) => Boolean(val));
				if (isMatch) {
					return HttpService.post(`/client`, `POST`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.clientSaveSuccess(resp.response))
									: Observable.of(actions.clientSaveFailure('Something went wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.clientSaveFailure(err.response))
									: Observable.of(actions.clientSaveFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.clientSaveFailure('All fields are required'));
				}
			})
		),
	getClient: (action$) =>
		action$.pipe(
			ofType(types.GETCLIENT),
			switchMap(() => {
				return HttpService.get(`/client`, `GET`).pipe(
					switchMap(
						(resp) =>
							resp.response.clients.length
								? Observable.of(actions.getClientSuccess(resp.response.clients))
								: Observable.of(actions.getClientSuccess([]))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.getClientFailure(err.response))
								: Observable.of(actions.getClientFailure('Network Error'))
					)
				);
			})
		),
	updateClient: (action$) =>
		action$.pipe(
			ofType(types.UPDATECLIENT),
			switchMap(({ payload }) => {
				const checkTransaction = checkEntries(payload._id, 'Client', 'Edit');
				if (checkTransaction.condition) {
					return Observable.of(actions.updateClientFailure(checkTransaction.message));
				}
				const isMatch = Object.values(payload).entries((val) => Boolean(val));
				if (isMatch) {
					return HttpService.put(`/client/${payload._id}`, `PUT`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.updateClientSuccess(resp.response))
									: Observable.of(actions.updateClientFailure('Something went Wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.updateClientFailure(err.response))
									: Observable.of(actions.updateClientFailure('Network Failure'))
						)
					);
				} else {
					return Observable.of(actions.updateClientFailure('All fields are required'));
				}
			})
		),
	deleteClient: (action$) =>
		action$.pipe(
			ofType(types.DELETECLIENT),
			switchMap(({ payload }) => {
				const checkTransaction = checkEntries(payload, 'Client', 'Delete');
				if (checkTransaction.condition) {
					return Observable.of(actions.deleteClientFailure(checkTransaction.message));
				}
				return HttpService.delete(`/client/${payload}`, `DELETE`).pipe(
					switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.deleteClientSuccess(resp.response))
								: Observable.of(actions.deleteClientFailure('Something went Wrong'))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.deleteClientFailure(err.response))
								: Observable.of(actions.deleteClientFailure('Network Failure'))
					)
				);
			})
		)
};

export default client;
