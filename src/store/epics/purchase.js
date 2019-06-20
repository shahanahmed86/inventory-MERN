import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import store from '../index';

const checkStock = () => {
	const { purchases, sales, products } = store.getState();
	const stockSum = {};
	products.forEach((x) => (stockSum[x._id] = 0));
	purchases.forEach((x) => x.products.forEach((y) => (stockSum[y.productId._id] += y.quantity)));
	sales.forEach((x) => x.products.forEach((y) => (stockSum[y.productId._id] -= y.quantity)));
	return stockSum;
};

const purchase = {
	purchaseSave: (action$) =>
		action$.ofType(types.PURCHASESAVE).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: 'http://localhost:8080/purchase',
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
						if (resp.response)
							return Observable.of(actions.onLoader(true), actions.purchaseSaveSuccess(resp.response));
						return Observable.of(actions.purchaseSaveFailure('Something went wrong'));
					})
					.catch(() => Observable.of(actions.purchaseSaveFailure('Network Error')));
			return Observable.of(actions.purchaseSaveFailure('All fields are required'));
		}),
	getPurchase: (action$) =>
		action$.ofType(types.GETPURCHASE).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/purchase',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response.length) {
						return Observable.of(actions.getPurchaseSuccess(resp.response));
					} else {
						return Observable.of(
							actions.getPurchaseSuccess([])
						);
					}
				})
				.catch(() => Observable.of(actions.getPurchaseFailure('Network Error')));
		}),
	updatePurchase: (action$) =>
		action$.ofType(types.UPDATEPURCHASE).switchMap(({ payload }) => {
			const { payments } = store.getState();
			const purchaseRecordFound = payments.some((x) => x.details.find((y) => y.purchaseId === payload._id));
			if (purchaseRecordFound)
				return Observable.of(
					actions.updatePurchaseFailure("Transaction found for this purchase you can't edit it")
				);
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
			if (messages.length) return Observable.of(actions.updatePurchaseFailure('Please rectify errors'));
			return Observable.ajax({
				url: `http://localhost:8080/purchase/${payload._id}`,
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
					return Observable.of(actions.onLoader(true), actions.updatePurchaseSuccess(resp.response));
				return Observable.of(actions.updatePurchaseFailure('something wrong'));
			});
		}),
	deletePurchase: (action$) =>
		action$.ofType(types.DELETEPURCHASE).switchMap(({ payload }) => {
			const { payments } = store.getState();
			const purchaseRecordFound = payments.some((x) => x.details.find((y) => y.purchaseId === payload));
			if (purchaseRecordFound)
				return Observable.of(
					actions.deletePurchaseFailure("Transaction found for this purchase you can't delete it")
				);
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
			if (messages.length) return Observable.of(actions.deletePurchaseFailure(messages.join(', ')));
			return Observable.ajax({
				url: `http://localhost:8080/purchase/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			}).switchMap((resp) => {
				if (typeof resp.response === 'string')
					return Observable.of(actions.deletePurchaseSuccess(resp.response));
				return Observable.of(actions.deletePurchaseFailure('something wrong'));
			});
		})
};

export default purchase;
