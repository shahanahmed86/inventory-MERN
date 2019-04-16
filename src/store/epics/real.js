import 'rxjs/Rx';
import { Observable } from 'rxjs';
import Pusher from 'pusher-js';

import types from '../constants';
import actions from '../actions';

const real = {
	onRealTimeData: (action$) =>
		action$.ofType(types.ONREALTIME).switchMap(() => {
			return Observable.ajax({
				url: 'http://localhost:8080/live',
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				async: true,
				crossDomain: true,
				withCredentials: true,
				createXHR: () => new XMLHttpRequest(),
				responseType: 'json'
			}).switchMap((resp) => {
				// Enable pusher logging - don't include this in production
				// Pusher.logToConsole = true;
				var pusher = new Pusher('f9126fc42e7cc112a924', {
					cluster: 'ap2',
					forceTLS: true
				});
				var channel = pusher.subscribe('my-channel');
				channel.bind('my-event', (data) => {
					console.log({ data, resp });
				});
			});
		})
};

export default real;
