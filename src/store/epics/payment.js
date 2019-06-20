import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const payment = {
	paymentSave: (action$) =>
		action$.ofType(types.PAYMENTSAVE).switchMap(({ payload }) => {
			const isFilled = [];
			payload.details.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
			});
			isFilled.push(Object.values(payload).every((val) => Boolean(val)));
			if (isFilled.every((val) => Boolean(val)))
				return Observable.ajax({
					url: 'http://localhost:8080/payment',
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
							return Observable.of(actions.onLoader(true), actions.paymentSaveSuccess(resp.response));
						return Observable.of(actions.paymentSaveFailure('Something went wrong'));
					})
					.catch(() => Observable.of(actions.paymentSaveFailure('Network Error')));
			return Observable.of(actions.paymentSaveFailure('All fields are required'));
		}),
	getPayment: (action$) =>
		action$.ofType(types.GETPAYMENT).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/payment',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response.length) return Observable.of(actions.getPaymentSuccess(resp.response));
					return Observable.of(actions.getPaymentSuccess([]));
				})
				.catch(() => Observable.of(actions.getPaymentFailure('Network Error')));
		}),
	updatePayment: (action$) =>
		action$.ofType(types.UPDATEPAYMENT).switchMap(({ payload }) => {
			const isFilled = [];
			payload.details.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
			});
			isFilled.push(Object.values(payload).every((val) => Boolean(val)));
			if (isFilled.every((val) => Boolean(val)))
				return Observable.ajax({
					url: `http://localhost:8080/payment/${payload._id}`,
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
						return Observable.of(actions.onLoader(true), actions.updatePaymentSuccess(resp.response));
					return Observable.of(actions.updatePaymentFailure('something wrong'));
				});
			return Observable.of(actions.updatePaymentFailure('All Fields are Required'));
		}),
	deletePayment: (action$) =>
		action$.ofType(types.DELETEPAYMENT).switchMap(({ payload }) => {
			return Observable.ajax({
				url: `http://localhost:8080/payment/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			}).switchMap((resp) => {
				if (typeof resp.response === 'string')
					return Observable.of(actions.deletePaymentSuccess(resp.response));
				return Observable.of(actions.deletePaymentFailure('something wrong'));
			});
		})
};

export default payment;