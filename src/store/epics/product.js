import 'rxjs/Rx';
import { switchMap, catchError } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import store from '../index';
import HttpService from '../../service';

const checkEntries = (id, book, text) => {
	const { purchases } = store.getState();
	return {
		condition: purchases.some((x) => x.products.find((y) => y.productId._id === id)),
		message: `Transaction found for this ${book} you can't ${text} it`
	};
};

const product = {
	productSave: (action$) =>
		action$.pipe(
			ofType(types.PRODUCTSAVE),
			switchMap(({ payload }) => {
				const isMatch = Object.values(payload).every((val) => Boolean(val));
				if (isMatch) {
					return HttpService.post(`https://inventory-app-mern.herokuapp.com/product`, `POST`, payload).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.productSaveSuccess(resp.response))
									: Observable.of(actions.productSaveFailure('Something went wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.productSaveFailure(err.response))
									: Observable.of(actions.productSaveFailure('Network Error'))
						)
					);
				} else {
					return Observable.of(actions.productSaveFailure('All fields are required'));
				}
			})
		),
	getProduct: (action$) =>
		action$.pipe(
			ofType(types.GETPRODUCT),
			switchMap(() => {
				return HttpService.get(`https://inventory-app-mern.herokuapp.com/product`, `GET`).pipe(
					switchMap(
						(resp) =>
							resp.response.products.length
								? Observable.of(actions.getProductSuccess(resp.response.products))
								: Observable.of(actions.getProductSuccess([]))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.getProductFailure(err.response))
								: Observable.of(actions.getProductFailure('Network Error'))
					)
				);
			})
		),
	updateProduct: (action$) =>
		action$.pipe(
			ofType(types.UPDATEPRODUCT),
			switchMap(({ payload }) => {
				const checkTransaction = checkEntries(payload._id, 'Product', 'Edit');
				if (checkTransaction.condition) {
					return Observable.of(actions.updateProductFailure(checkTransaction.message));
				}
				const isMatch = Object.values(payload).entries((val) => Boolean(val));
				if (isMatch) {
					return HttpService.put(
						`https://inventory-app-mern.herokuapp.com/product/${payload._id}`,
						`PUT`,
						payload
					).pipe(
						switchMap(
							(resp) =>
								typeof resp.response === 'string'
									? Observable.of(actions.onLoader(true), actions.updateProductSuccess(resp.response))
									: Observable.of(actions.updateProductFailure('Something went Wrong'))
						),
						catchError(
							(err) =>
								typeof err.response === 'string'
									? Observable.of(actions.updateProductFailure(err.response))
									: Observable.of(actions.updateProductFailure('Network Failure'))
						)
					);
				} else {
					return Observable.of(actions.updateProductFailure('All fields are required'));
				}
			})
		),
	deleteProduct: (action$) =>
		action$.pipe(
			ofType(types.DELETEPRODUCT),
			switchMap(({ payload }) => {
				const checkTransaction = checkEntries(payload, 'Product', 'Delete');
				if (checkTransaction.condition) {
					return Observable.of(actions.updateProductFailure(checkTransaction.message));
				}
				return HttpService.delete(`https://inventory-app-mern.herokuapp.com/product/${payload}`, `DELETE`).pipe(
					switchMap(
						(resp) =>
							typeof resp.response === 'string'
								? Observable.of(actions.deleteProductSuccess(resp.response))
								: Observable.of(actions.deleteProductFailure('Something went Wrong'))
					),
					catchError(
						(err) =>
							typeof err.response === 'string'
								? Observable.of(actions.deleteProductFailure(err.response))
								: Observable.of(actions.deleteProductFailure('Network Failure'))
					)
				);
			})
		)
};

export default product;
