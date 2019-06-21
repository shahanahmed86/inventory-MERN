import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import store from '../index';

const checkEntries = (id, book, text) => {
	const { purchases } = store.getState();
	return {
		condition: purchases.some((x) => x.products.find((y) => y.productId._id === id)),
		message: `Transaction found for this ${book} you can't ${text} it`
	};
}

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
					.switchMap(
						(resp) => typeof resp.response === 'string' ? (
							Observable.of(actions.onLoader(true), actions.productSaveSuccess(resp.response))
						) : (
								Observable.of(actions.productSaveFailure('Something went wrong'))
							)
					)
					.catch(
						(err) => typeof err.response === 'string' ? (
							Observable.of(actions.productSaveFailure(err.response))
						) : (
								Observable.of(actions.productSaveFailure('Network Error'))
							)
					);
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
				.switchMap(
					(resp) => resp.response.products.length ? (
						Observable.of(actions.getProductSuccess(resp.response.products))
					) : (
							Observable.of(actions.getProductFailure('Something went wrong'))
						)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(actions.getProductFailure(err.response))
					) : (
							Observable.of(actions.getProductFailure('Network Error'))
						)
				);
		}),
	updateProduct: (action$) =>
		action$.ofType(types.UPDATEPRODUCT).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload._id, 'Product', 'Edit');
			if (checkTransaction.condition) {
				return Observable.of(
					actions.updateProductFailure(checkTransaction.message)
				);
			}
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
					.switchMap(
						(resp) => typeof resp.response === 'string' ? (
							Observable.of(actions.onLoader(true), actions.updateProductSuccess(resp.response))
						) : (
								Observable.of(actions.updateProductFailure('Something went Wrong'))
							)
					)
					.catch(
						(err) => typeof err.response === 'string' ? (
							Observable.of(actions.updateProductFailure(err.response))
						) : (
								Observable.of(actions.updateProductFailure('Network Failure'))
							)
					);
			return Observable.of(actions.updateProductFailure('All fields are required'));
		}),
	deleteProduct: (action$) =>
		action$.ofType(types.DELETEPRODUCT).switchMap(({ payload }) => {
			const checkTransaction = checkEntries(payload, 'Product', 'Delete');
			if (checkTransaction.condition) {
				return Observable.of(
					actions.updateProductFailure(checkTransaction.message)
				);
			}
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
				.switchMap(
					(resp) => typeof resp.response === 'string' ? (
						Observable.of(actions.deleteProductSuccess(resp.response))
					) : (
							Observable.of(actions.deleteProductFailure('Something went Wrong'))
						)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(actions.deleteProductFailure(err.response))
					) : (
							Observable.of(actions.deleteProductFailure('Network Failure'))
						)
				);
		})
};

export default product;
