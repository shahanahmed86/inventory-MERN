import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import store from '../index';

const product = {
	productSave: (action$) =>
		action$.ofType(types.PRODUCTSAVE).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: 'http://localhost:8080/product',
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
							return Observable.of(actions.onLoader(true), actions.productSaveSuccess(resp.response));
						return Observable.of(actions.productSaveFailure('Something went wrong'));
					})
					.catch(() => Observable.of(actions.productSaveFailure('Network Error')));
			return Observable.of(actions.productSaveFailure('All fields are required'));
		}),
	getProduct: (action$) =>
		action$.ofType(types.GETPRODUCT).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/product',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response.products.length) {
						return Observable.of(actions.getProductSuccess(resp.response.products));
					} else {
						return Observable.of(actions.getProductSuccess([]));
					}
				})
				.catch(() => Observable.of(actions.getProductFailure('Network Error')));
		}),
	updateProduct: (action$) =>
		action$.ofType(types.UPDATEPRODUCT).switchMap(({ payload }) => {
			const { purchases } = store.getState();
			const productRecordFound = purchases.some((x) => x.products.find((y) => y.productId._id === payload._id));
			if (productRecordFound)
				return Observable.of(
					actions.updateProductFailure("Transaction found for this product you can't edit it")
				);
			const isMatch = Object.values(payload).entries((val) => Boolean(val));
			if (isMatch)
				return Observable.ajax({
					url: `http://localhost:8080/product/${payload._id}`,
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
						if (resp.response)
							return Observable.of(actions.onLoader(true), actions.updateProductSuccess(resp.response));
						return Observable.of(actions.updateProductFailure('Something went Wrong'));
					})
					.catch(() => Observable.of(actions.updateProductFailure('Network Failure')));
			return Observable.of(actions.updateProductFailure('All fields are required'));
		}),
	deleteProduct: (action$) =>
		action$.ofType(types.DELETEPRODUCT).switchMap(({ payload }) => {
			const { purchases } = store.getState();
			const productRecordFound = purchases.some((x) => x.products.find((y) => y.productId._id === payload));
			if (productRecordFound)
				return Observable.of(
					actions.updateProductFailure("Transaction found for this product you can't delete it")
				);
			return Observable.ajax({
				url: `http://localhost:8080/product/${payload}`,
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((resp) => {
					if (resp.response) return Observable.of(actions.deleteProductSuccess(resp.response));
					return Observable.of(actions.deleteProductFailure('Something went Wrong'));
				})
				.catch(() => Observable.of(actions.deleteProductFailure('Network Failure')));
		})
};

export default product;
