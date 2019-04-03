import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';

const login = {
	signUp: (action$) =>
		action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
			return Observable.ajax({
				url: 'http://localhost:8080/user/signup',
				body: payload,
				async: true,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				crossDomain: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((res) => {
					return Observable.of(
						actions.onLoader(true),
						actions.onLoader(false),
						actions.signUpAccess(),
						actions.onSnackHandler({ snack: true, message: res.response })
					);
				})
				.catch((err) => {
					return Observable.of(
						actions.signUpAccess(),
						actions.onSnackHandler({ snack: true, message: err.response })
					);
				});
		}),
	signIn: (action$) =>
		action$.ofType(types.SIGNIN).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((x) => Boolean(x));
			if (isMatch)
				return Observable.ajax({
					url: 'http://localhost:8080/user/signin',
					method: 'POST',
					body: payload,
					headers: { 'Content-Type': 'application/json' },
					async: true,
					crossDomain: true,
					withCredentials: true,
					createXHR: () => new XMLHttpRequest(),
					responseType: 'json'
				})
					.switchMap((res) => {
						return Observable.of(
							actions.signInSuccess(),
							actions.isLoggedIn(),
							actions.onSnackHandler({ snack: true, message: res.response })
						);
					})
					.catch((err) => {
						return Observable.of(
							actions.signInFailure(),
							actions.onSnackHandler({ snack: true, message: err.response })
						);
					});
			return Observable.of(
				actions.signInFailure(),
				actions.onSnackHandler({ snack: true, message: 'Please Enter Email & Password, in order to login' })
			);
		}),
	signOut: (action$) =>
		action$.ofType(types.SIGNOUT).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/user/logout',
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((res) => {
					if (res.response)
						return Observable.of(
							actions.signOutSuccess(),
							actions.onSnackHandler({ snack: true, message: res.response })
						);
					return Observable.of(
						actions.signOutFailure(),
						actions.onSnackHandler({ snack: true, message: 'Something went wrong' })
					);
				})
				.catch((err) => {
					if (err.response)
						return Observable.of(
							actions.signOutFailure(),
							actions.onSnackHandler({ snack: true, message: err.response })
						);
					return Observable.of(actions.signOutFailure('Network Error'));
				});
		}),
	isLoggedIn: (action$) =>
		action$.ofType(types.ISLOGGEDIN).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/user',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			})
				.switchMap((res) => {
					if (res.response.doc) return Observable.of(actions.isLoggedInSuccess(res.response.doc));
					return Observable.of(actions.isLoggedInFailure('Token Expired'));
				})
				.catch((err) => {
					if (err.response) return Observable.of(actions.isLoggedInFailure(err.response));
					return Observable.of(actions.isLoggedInFailure('Network Error'));
				});
		})
};

export default login;
