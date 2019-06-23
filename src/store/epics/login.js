import 'rxjs/Rx';
import { Observable } from 'rxjs';

import types from '../constants';
import actions from '../actions';
import HttpService from '../../service';

const login = {
	signUp: (action$) =>
		action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
			return HttpService.signUp(`https://inventory-app-mern.herokuapp.com/user/signup`, `POST`, payload)
				.switchMap(
					(res) => typeof res.response === 'string' && (
						Observable.of(
							actions.onLoader(true),
							actions.onLoader(false),
							actions.signUpAccess(),
							actions.onSnackHandler({ snack: true, message: res.response })
						)
					)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(
							actions.signUpAccess(),
							actions.onSnackHandler({ snack: true, message: err.response })
						)
					) : (
							Observable.of(
								actions.signUpAccess(),
								actions.onSnackHandler({ snack: true, message: "Network Error" })
							)
						)
				);
		}),
	signIn: (action$) =>
		action$.ofType(types.SIGNIN).switchMap(({ payload }) => {
			const isMatch = Object.values(payload).every((x) => Boolean(x));
			if (isMatch)
				return HttpService.post(`https://inventory-app-mern.herokuapp.com/user/signin`, `POST`, payload)
					.switchMap(
						(res) => typeof res.response === 'string' && (
							Observable.of(
								actions.signInSuccess(),
								actions.isLoggedIn(),
								actions.onSnackHandler({ snack: true, message: res.response })
							)
						)
					)
					.catch(
						(err) => typeof err.response === 'string' ? (
							Observable.of(
								actions.signInFailure(),
								actions.onSnackHandler({ snack: true, message: err.response })
							)
						) : (
								Observable.of(
									actions.signInFailure(),
									actions.onSnackHandler({ snack: true, message: "Network Error" })
								)
							)
					);
			return Observable.of(
				actions.signInFailure(),
				actions.onSnackHandler({ snack: true, message: 'Please Enter Email & Password, in order to login' })
			);
		}),
	signOut: (action$) =>
		action$.ofType(types.SIGNOUT).switchMap(() => {
			return HttpService.signOut(`https://inventory-app-mern.herokuapp.com/user/logout`, `POST`)
				.switchMap(
					(res) => typeof res.response === 'string' && (
						Observable.of(
							actions.signOutSuccess(),
							actions.onSnackHandler({ snack: true, message: res.response })
						)
					)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(
							actions.signOutFailure(),
							actions.onSnackHandler({ snack: true, message: err.response })
						)
					) : (
							Observable.of(
								actions.signOutFailure(),
								actions.onSnackHandler({ snack: true, message: "Network Error" })
							)
						)
				);
		}),
	isLoggedIn: (action$) =>
		action$.ofType(types.ISLOGGEDIN).switchMap(() => {
			return HttpService.get(`https://inventory-app-mern.herokuapp.com/user`, `GET`)
				.switchMap(
					(res) => res.response.doc ? (
						Observable.of(actions.isLoggedInSuccess(res.response.doc))
					) : (
							Observable.of(actions.isLoggedInFailure('Token Expired'))
						)
				)
				.catch(
					(err) => typeof err.response === 'string' ? (
						Observable.of(
							actions.isLoggedInFailure(),
							actions.onSnackHandler({ snack: true, message: err.response })
						)
					) : (
							Observable.of(
								actions.isLoggedInFailure(),
								actions.onSnackHandler({ snack: true, message: "Network Error" })
							)
						)
				);
		})
};

export default login;