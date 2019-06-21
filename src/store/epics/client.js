import 'rxjs/Rx';
import { Observable } from 'rxjs';

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
		action$.ofType(types.CLIENTSAVE).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((val) => Boolean(val));
			if (isMatch)
				return HttpService.post(`http://localhost:8080/client`, `POST`, payload)
					.switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.onLoader(true), actions.clientSaveSuccess(resp.response))
								: Observable.of(actions.clientSaveFailure('Something went wrong'))
					)
					.catch(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.clientSaveFailure(err.response))
								: Observable.of(actions.clientSaveFailure('Network Error'))
					);
			return Observable.of(actions.clientSaveFailure('All fields are required'));
		}),
	getClient: (action$) =>
		action$.ofType(types.GETCLIENT).switchMap(() => {
			return HttpService.get(`http://localhost:8080/client`, `GET`)
				.switchMap(
					(resp) =>
						resp.response.clients.length
							? Observable.of(actions.getClientSuccess(resp.response.clients))
							: Observable.of(actions.getClientFailure('Something went wrong'))
				)
				.catch(
					(err) =>
						typeof err.response === 'string'
							? Observable.of(actions.getClientFailure(err.response))
							: Observable.of(actions.getClientFailure('Network Error'))
				);
		}),
	updateClient: (action$) =>
		action$.ofType(types.UPDATECLIENT).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload._id, 'Client', 'Edit');
			if (checkTransaction.condition) {
				return Observable.of(actions.updateClientFailure(checkTransaction.message));
			}
			const isMatch = Object.values(payload).entries((val) => Boolean(val));
			if (isMatch)
				return HttpService.put(`http://localhost:8080/client/${payload._id}`, `PUT`, payload)
					.switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.onLoader(true), actions.updateClientSuccess(resp.response))
								: Observable.of(actions.updateClientFailure('Something went Wrong'))
					)
					.catch(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.updateClientFailure(err.response))
								: Observable.of(actions.updateClientFailure('Network Failure'))
					);
			return Observable.of(actions.updateClientFailure('All fields are required'));
		}),
	deleteClient: (action$) =>
		action$.ofType(types.DELETECLIENT).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload, 'Client', 'Delete');
			if (checkTransaction.condition) {
				return Observable.of(actions.deleteClientFailure(checkTransaction.message));
			}
			return HttpService.delete(`http://localhost:8080/client/${payload}`, `DELETE`)
				.switchMap(
					(resp) =>
						typeof resp.response === 'string'
							? Observable.of(actions.deleteClientSuccess(resp.response))
							: Observable.of(actions.deleteClientFailure('Something went Wrong'))
				)
				.catch(
					(err) =>
						typeof err.response === 'string'
							? Observable.of(actions.deleteClientFailure(err.response))
							: Observable.of(actions.deleteClientFailure('Network Failure'))
				);
		})
};

export default client;
