import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import HttpService from '../../service';

const payment = {
	paymentSave: (action$) =>
		action$.ofType(types.PAYMENTSAVE).switchMap(({ payload }) => {
			const isFilled = [];
			payload.details.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
			});
			isFilled.push(Object.values(payload).every((val) => Boolean(val)));
			if (isFilled.every((val) => Boolean(val)))
				return HttpService.post(`http://localhost:8080/payment`, `POST`, payload)
					.switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.onLoader(true), actions.paymentSaveSuccess(resp.response))
								: Observable.of(actions.paymentSaveFailure('Something went wrong'))
					)
					.catch(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.paymentSaveFailure(err.response))
								: Observable.of(actions.paymentSaveFailure('Network Error'))
					);
			return Observable.of(actions.paymentSaveFailure('All fields are required'));
		}),
	getPayment: (action$) =>
		action$.ofType(types.GETPAYMENT).switchMap(() => {
			return HttpService.get(`http://localhost:8080/payment`, `GET`)
				.switchMap(
					(resp) =>
						resp.response.length
							? Observable.of(actions.getPaymentSuccess(resp.response))
							: Observable.of(actions.getPaymentSuccess([]))
				)
				.catch(
					(err) =>
						typeof err.response === 'string'
							? Observable.of(actions.getPaymentFailure(err.response))
							: Observable.of(actions.getPaymentFailure('Network Error'))
				);
		}),
	updatePayment: (action$) =>
		action$.ofType(types.UPDATEPAYMENT).switchMap(({ payload }) => {
			const isFilled = [];
			payload.details.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => y === false || Boolean(y)));
			});
			isFilled.push(Object.values(payload).every((val) => Boolean(val)));
			if (isFilled.every((val) => Boolean(val)))
				return HttpService.put(`http://localhost:8080/payment/${payload._id}`, `PUT`, payload)
					.switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.onLoader(true), actions.updatePaymentSuccess(resp.response))
								: Observable.of(actions.updatePaymentFailure('something wrong'))
					)
					.catch(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.updatePaymentFailure(err.response))
								: Observable.of(actions.updatePaymentFailure('Network Error'))
					);
			return Observable.of(actions.updatePaymentFailure('All Fields are Required'));
		}),
	deletePayment: (action$) =>
		action$.ofType(types.DELETEPAYMENT).switchMap(({ payload }) => {
			return HttpService.delete(`http://localhost:8080/payment/${payload}`, `DELETE`)
				.switchMap(
					(resp) =>
						typeof resp.response === 'string'
							? Observable.of(actions.deletePaymentSuccess(resp.response))
							: Observable.of(actions.deletePaymentFailure('something wrong'))
				)
				.catch(
					(err) =>
						typeof err.response === 'string'
							? Observable.of(actions.updatePaymentFailure(err.response))
							: Observable.of(actions.updatePaymentFailure('Network Error'))
				);
		})
};

export default payment;
