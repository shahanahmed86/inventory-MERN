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

const sale = {
	saleSave: (action$) =>
		action$.ofType(types.SALESAVE).switchMap(({ payload }) => {
			const isFilled = [];
			payload.products.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => Boolean(y) || y === false));
			});
			Object.values(payload).forEach((x) => {
				isFilled.push(Object.values(x).every((y) => Boolean(y)));
			});
			const messages = [];
			const stock = checkStock();
			payload.products.forEach((value) => {
				if (stock[value.productId] < value.quantity) {
					messages.push(
						`${value.productName} will be negative by ${stock[value.productId] - value.quantity}`
					);
				}
			});
			if (messages.length) return Observable.of(actions.saleSaveFailure(messages.join(', ')));
			if (isFilled.every((val) => Boolean(val)))
				return Observable.ajax({
					url: 'http://localhost:8080/sale',
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
							return Observable.of(actions.onLoader(true), actions.saleSaveSuccess(resp.response));
						return Observable.of(actions.saleSaveFailure('Something went wrong'));
					})
					.catch((err) => {
						if (typeof err.response === 'string')
							return Observable.of(actions.saleSaveFailure(err.response));
						return Observable.of(actions.saleSaveFailure('Network Error'));
					});
			return Observable.of(actions.saleSaveFailure('All fields are required'));
		}),
	getSale: (action$) =>
		action$.ofType(types.GETSALE).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/sale',
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
						return Observable.of(actions.getSaleSuccess(resp.response));
					} else {
						return Observable.of(actions.getSaleSuccess([]), actions.onDialog(false));
					}
				})
				.catch((err) => {
					if (typeof err.response === 'string') return Observable.of(actions.getSaleFailure(err.response));
					return Observable.of(actions.getSaleFailure('Something went wrong'));
				});
		}),
	updateSale: (action$) =>
		action$.ofType(types.UPDATESALE).switchMap(({ payload }) => {
			const isFilled = [];
			payload.products.forEach((x) => {
				isFilled.push(Object.values(x).every((y) => Boolean(y) || y === false));
			});
			Object.values(payload).forEach((x) => {
				isFilled.push(Object.values(x).every((y) => Boolean(y)));
			});
			const messages = [];
			const stock = checkStock();
			payload.products.forEach((value) => {
				if (value.oldProductId === value.productId) {
					const qty = stock[value.oldProductId] + value.oldQuantity - value.quantity;
					if (qty < 0) {
						messages.push(
							`${value.productName} will be negative by ${stock[value.productId] - value.quantity}`
						);
					}
				} else {
					const qty = stock[value.productId] - value.quantity;
					if (qty < 0) {
						messages.push(
							`${value.productName} will be negative by ${stock[value.productId] - value.quantity}`
						);
					}
				}
			});
			if (messages.length) return Observable.of(actions.saleSaveFailure(messages.join(', ')));
			if (isFilled.every((val) => Boolean(val)))
				return Observable.ajax({
					url: `http://localhost:8080/sale/${payload._id}`,
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
						if (typeof resp.response === 'string')
							return Observable.of(actions.onLoader(true), actions.updateSaleSuccess(resp.response));
						return Observable.of(actions.updateSaleFailure('Something went wrong'));
					})
					.catch((err) => {
						if (typeof err.response === 'string')
							return Observable.of(actions.updateSaleFailure(err.response));
						return Observable.of(actions.updateSaleFailure('Something went wrong'));
					});
			return Observable.of(actions.updateSaleFailure('All fields are required'));
		}),
	deleteSale: (action$) =>
		action$.ofType(types.DELETESALE).switchMap(({ payload }) => {
			return Observable.ajax({
				url: `http://localhost:8080/sale/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			}).switchMap((resp) => {
				if (typeof resp.response === 'string')
					return Observable.of(actions.deleteSaleSuccess(resp.response), actions.getSale());
				return Observable.of(actions.deleteSaleFailure('something wrong'));
			});
		})
};

export default sale;
