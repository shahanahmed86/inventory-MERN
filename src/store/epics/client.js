import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const client = {
	clientSave: (action$) =>
		action$.ofType(types.CLIENTSAVE).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: 'http://localhost:8080/client',
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
						if (resp.response) return Observable.of(actions.clientSaveSuccess(resp.response));
						return Observable.of(actions.clientSaveFailure('Something went wrong'));
					})
					.catch((err) => {
						if (err.response) return Observable.of(actions.clientSaveFailure(err.response));
						return Observable.of(actions.clientSaveFailure('Network Error'));
					});
			return Observable.of(actions.clientSaveFailure('All fields are required'));
		}),
	getClient: (action$) =>
		action$.ofType(types.GETCLIENT).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/client',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response.clients.length) {
						return Observable.of(actions.getClientSuccess(resp.response.clients));
					} else {
						return Observable.of(
							actions.getClientSuccess([]),
							actions.onDialog(false),
							actions.onSnackHandler({ snack: true, message: 'Client Data is empty' })
						);
					}
				})
				.catch((err) => {
					if (err.response) return Observable.of(actions.getClientFailure(err.response));
					return Observable.of(actions.getClientFailure('Network Error'));
				});
		}),
	updateClient: (action$) =>
		action$.ofType(types.UPDATECLIENT).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).entries((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: `http://localhost:8080/client/${payload._id}`,
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
						if (resp.response) return Observable.of(actions.updateClientSuccess(resp.response));
						return Observable.of(actions.updateClientFailure('Something went Wrong'));
					})
					.catch(() => {
						return Observable.of(actions.updateClientFailure('Network Failure'));
					});
			return Observable.of(actions.updateClientFailure('All fields are required'));
		}),
	deleteClient: (action$) =>
		action$.ofType(types.DELETECLIENT).switchMap(({ payload }) => {
			return Observable.ajax({
				url: `http://localhost:8080/client/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response)
						return Observable.of(actions.deleteClientSuccess(resp.response), actions.getClient());
					return Observable.of(actions.deleteClientFailure('Something went Wrong'));
				})
				.catch(() => {
					return Observable.of(actions.deleteClientFailure('Network Failure'));
				});
		})
};

export default client;
