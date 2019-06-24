import 'rxjs/Rx';
import { switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs/Rx';

import types from '../constants';
import actions from '../actions';
import HttpService from '../../service';

const payment = {
	paymentSave: (action$) =>
		action$.pipe(
			ofType(types.PAYMENTSAVE),
			switchMap(({ payload }) => {
				const isFilled = [];
				payload.details.forEach((x) => {
					isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
				});
				isFilled.push(Object.values(payload).every((val) => Boolean(val)));
				if (isFilled.every((val) => Boolean(val))) {
					return HttpService.post(`/payment`, `POST`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.paymentSaveSuccess(resp.response))
									: Observable.of(actions.paymentSaveFailure('Something went wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.paymentSaveFailure(err.response))
									: Observable.of(actions.paymentSaveFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.paymentSaveFailure('All fields are required'));
				}
			})
		),
	getPayment: (action$) =>
		action$.pipe(
			ofType(types.GETPAYMENT),
			switchMap(() => {
				return HttpService.get(`/payment`, `GET`).pipe(
					switchMap(
						(resp) =>
							resp.response.length
								? Observable.of(actions.getPaymentSuccess(resp.response))
								: Observable.of(actions.getPaymentSuccess([]))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.getPaymentFailure(err.response))
								: Observable.of(actions.getPaymentFailure('Network Error'))
					)
				);
			})
		),
	updatePayment: (action$) =>
		action$.pipe(
			ofType(types.UPDATEPAYMENT),
			switchMap(({ payload }) => {
				const isFilled = [];
				payload.details.forEach((x) => {
					isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
				});
				isFilled.push(Object.values(payload).every((val) => Boolean(val)));
				if (isFilled.every((val) => Boolean(val))) {
					return HttpService.put(`/payment/${payload._id}`, `PUT`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.updatePaymentSuccess(resp.response))
									: Observable.of(actions.updatePaymentFailure('something wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.updatePaymentFailure(err.response))
									: Observable.of(actions.updatePaymentFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.updatePaymentFailure('All Fields are Required'));
				}
			})
		),
	deletePayment: (action$) =>
		action$.pipe(
			ofType(types.DELETEPAYMENT),
			switchMap(({ payload }) => {
				return HttpService.delete(`/payment/${payload}`, `DELETE`).pipe(
					switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.deletePaymentSuccess(resp.response))
								: Observable.of(actions.deletePaymentFailure('Something went wrong'))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.updatePaymentFailure(err.response))
								: Observable.of(actions.updatePaymentFailure('Network Error'))
					)
				);
			})
		)
};

export default payment;
