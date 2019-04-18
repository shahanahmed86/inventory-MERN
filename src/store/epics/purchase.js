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
					.catch((err) => {
						if (err.response) return Observable.of(actions.purchaseSaveFailure(err.response));
						return Observable.of(actions.purchaseSaveFailure('Network Error'));
					});
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
							actions.getPurchaseSuccess([]),
							actions.onSnackHandler({ snack: true, message: 'Purchase Data is empty' })
						);
					}
				})
				.catch((err) => {
					if (err.response) return Observable.of(actions.getPurchaseFailure(err.response));
					return Observable.of(actions.getPurchaseFailure('Network Error'));
				});
		}),
	deletePurchase: (action$) =>
		action$.ofType(types.DELETEPURCHASE).switchMap(({ payload }) => {
			const stock = checkStock();
			const { products } = store.getState().purchases.find((x) => x._id === payload);
			const messages = [];
			products.forEach((value) => {
				if ((+stock[value.productId._id] - +value.quantity) < 0) {
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
				if (typeof resp.response === 'string') return Observable.of(actions.deleteSaleSuccess(resp.response));
				return Observable.of(actions.deleteSaleFailure('something wrong'));
			});
		})
};

export default purchase;
