import 'rxjs/Rx';
import { Observable } from 'rxjs';

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
	const { recoveries } = store.getState();
	return {
		condition: recoveries.some((x) => x.details.find((y) => y.saleId === id)),
		message: `Transaction found for this ${book} you can't ${text} it`
	};
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
			if (messages.length) return Observable.of(actions.saleSaveFailure('Please resolve errors'));
			if (isFilled.every((val) => Boolean(val)))
				return HttpService.post(`http://localhost:8080/sale`, `POST`, payload)
					.switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.onLoader(true), actions.saleSaveSuccess(resp.response))
								: Observable.of(actions.saleSaveFailure('Something went wrong'))
					)
					.catch(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.saleSaveFailure(err.response))
								: Observable.of(actions.saleSaveFailure('Network Error'))
					);
			return Observable.of(actions.saleSaveFailure('All fields are required'));
		}),
	getSale: (action$) =>
		action$.ofType(types.GETSALE).switchMap(() => {
			return HttpService.get(`http://localhost:8080/sale`, `GET`)
				.switchMap(
					(resp) =>
						resp.response.length
							? Observable.of(actions.getSaleSuccess(resp.response))
							: Observable.of(actions.getSaleSuccess([]))
				)
				.catch(
					(err) =>
						typeof err.response === 'string'
							? Observable.of(actions.getSaleFailure(err.response))
							: Observable.of(actions.getSaleFailure('Network Error'))
				);
		}),
	updateSale: (action$) =>
		action$.ofType(types.UPDATESALE).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload._id, 'Sale', 'edit');
			if (checkTransaction.condition) {
				return Observable.of(actions.updateSaleFailure(checkTransaction.message));
			}
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
			if (messages.length) return Observable.of(actions.updateSaleFailure('Please resolve errors'));
			if (isFilled.every((val) => Boolean(val)))
				return HttpService.put(`http://localhost:8080/sale/${payload._id}`, `PUT`, payload)
					.switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.onLoader(true), actions.updateSaleSuccess(resp.response))
								: Observable.of(actions.updateSaleFailure('Something went wrong'))
					)
					.catch(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.updateSaleFailure(err.response))
								: Observable.of(actions.updateSaleFailure('Network Error'))
					);
			return Observable.of(actions.updateSaleFailure('All fields are required'));
		}),
	deleteSale: (action$) =>
		action$.ofType(types.DELETESALE).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload, 'Sale', 'delete');
			if (checkTransaction.condition) {
				return Observable.of(actions.deleteSaleFailure(checkTransaction.message));
			}
			return HttpService.delete(`http://localhost:8080/sale/${payload}`, `DELETE`)
				.switchMap(
					(resp) =>
						typeof resp.response === 'string'
							? Observable.of(actions.deleteSaleSuccess(resp.response))
							: Observable.of(actions.deleteSaleFailure('something wrong'))
				)
				.catch(
					(err) =>
						typeof err.response === 'string'
							? Observable.of(actions.deleteSaleFailure(err.response))
							: Observable.of(actions.deleteSaleFailure('Network Error'))
				);
		})
};

export default sale;
