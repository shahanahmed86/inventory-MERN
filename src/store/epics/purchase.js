import 'rxjs/Rx';
import { switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs/Rx';

import types from '../constants';
import actions from '../actions';
import store from '../index';
import HttpService from '../../service';

const checkStock = () => {
	const { purchases, sales, products } = store.getState();
	const stockSum = {};
	products.forEach((x) => (stockSum[x._id] = 0));
	purchases.forEach((x) => x.products.forEach((y) => (stockSum[y.productId._id] += y.quantity)));
	sales.forEach((x) => x.products.forEach((y) => (stockSum[y.productId._id] -= y.quantity)));
	return stockSum;
};

const checkEntries = (id, book, text) => {
	const { payments } = store.getState();
	return {
		condition: payments.some((x) => x.details.find((y) => y.purchaseId === id)),
		message: `Transaction found for this ${book} you can't ${text} it`
	};
};

const purchase = {
	purchaseSave: (action$) =>
		action$.pipe(
			ofType(types.PURCHASESAVE),
			switchMap(({ payload }) => {
				const isMatch = Object.values(payload).every((val) => Boolean(val));
				if (isMatch) {
					return HttpService.post(`/purchase`, `POST`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.purchaseSaveSuccess(resp.response))
									: Observable.of(actions.purchaseSaveFailure('Something went wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.purchaseSaveFailure(err.response))
									: Observable.of(actions.purchaseSaveFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.purchaseSaveFailure('All fields are required'));
				}
			})
		),
	getPurchase: (action$) =>
		action$.pipe(
			ofType(types.GETPURCHASE),
			switchMap(() => {
				return HttpService.get(`/purchase`, `GET`).pipe(
					switchMap(
						(resp) =>
							resp.response.length
								? Observable.of(actions.getPurchaseSuccess(resp.response))
								: Observable.of(actions.getPurchaseSuccess([]))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.getPurchaseFailure(err.response))
								: Observable.of(actions.getPurchaseFailure('Network Error'))
					)
				);
			})
		),
	updatePurchase: (action$) =>
		action$.pipe(
			ofType(types.UPDATEPURCHASE),
			switchMap(({ payload }) => {
				const checkTransaction = checkEntries(payload._id, 'Purchase', 'Edit');
				if (checkTransaction.condition) {
					return Observable.of(actions.updatePurchaseFailure(checkTransaction.message));
				}
				const stock = checkStock();
				const messages = [];
				payload.products.forEach((value) => {
					if (value.oldProductId) {
						if (value.oldProductId === value.productId) {
							const qty = +stock[value.oldProductId] - +value.oldQuantity + +value.quantity;
							if (qty < 0) {
								messages.push(`if Block: ${value.productName} will be negative by ${qty}`);
							}
						} else {
							const qty = +stock[value.oldProductId] - +value.oldQuantity;
							if (qty < 0) {
								messages.push(`else Block: ${value.productName} will be negative by ${qty}`);
							}
						}
					}
				});
				if (messages.length) {
					return Observable.of(actions.updatePurchaseFailure('Please rectify errors'));
				} else {
					return HttpService.put(`/purchase/${payload._id}`, `PUT`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(
											actions.onLoader(true),
											actions.updatePurchaseSuccess(resp.response)
										)
									: Observable.of(actions.updatePurchaseFailure('something wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.updatePurchaseFailure(err.response))
									: Observable.of(actions.updatePurchaseFailure('Network Error'))
						)
					);
				}
			})
		),
	deletePurchase: (action$) =>
		action$.pipe(
			ofType(types.DELETEPURCHASE),
			switchMap(({ payload }) => {
				const checkTransaction = checkEntries(payload, 'Purchase', 'delete');
				if (checkTransaction.condition) {
					return Observable.of(actions.deletePurchaseFailure(checkTransaction.message));
				}
				const stock = checkStock();
				const { products } = store.getState().purchases.find((x) => x._id === payload);
				const messages = [];
				products.forEach((value) => {
					const qty = +stock[value.productId._id] - +value.quantity;
					if (qty < 0) {
						messages.push(
							`${value.productId.productName} will be negative by ${stock[value.productId._id] -
								value.quantity}`
						);
					}
				});
				if (messages.length) {
					return Observable.of(actions.deletePurchaseFailure(messages.join(', ')));
				} else {
					return HttpService.delete(`/purchase/${payload}`, `DELETE`).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.deletePurchaseSuccess(resp.response))
									: Observable.of(actions.deletePurchaseFailure('something wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.deletePurchaseFailure(err.response))
									: Observable.of(actions.deletePurchaseFailure('Network Error'))
						)
					);
				}
			})
		)
};

export default purchase;
