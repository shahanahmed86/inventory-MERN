import { Observable } from 'rxjs/Rx';

const HttpService = {
	//Post request HTTP service
	post: (url, method, body) => {
		return Observable.ajax({
			url,
			method,
			body,
			headers: { 'Content-Type': 'application/json' },
			async: true,
			crossDomain: true,
			withCredentials: true,
			createXHR: () => new XMLHttpRequest(),
			responseType: 'json'
		});
	},
	//Get request HTTP service
	get: (url, method) => {
		return Observable.ajax({
			url,
			method,
			headers: { 'Content-Type': 'application/json' },
			async: true,
			crossDomain: true,
			withCredentials: true,
			createXHR: () => new XMLHttpRequest(),
			responseType: 'json'
		});
	},
	//Put request HTTP service
	put: (url, method, body) => {
		return Observable.ajax({
			url,
			method,
			body,
			headers: { 'Content-Type': 'application/json' },
			async: true,
			crossDomain: true,
			withCredentials: true,
			createXHR: () => new XMLHttpRequest(),
			responseType: 'json'
		});
	},
	//Delete request HTTP service
	delete: (url, method) => {
		return Observable.ajax({
			url,
			method,
			headers: { 'Content-Type': 'application/json' },
			async: true,
			crossDomain: true,
			withCredentials: true,
			createXHR: () => new XMLHttpRequest(),
			responseType: 'json'
		});
	},
	//Signup request HTTP service
	signUp: (url, method, body) => {
		return Observable.ajax({
			url,
			method,
			body,
			headers: { 'Content-Type': 'application/json' },
			async: true,
			crossDomain: true,
			createXHR: () => new XMLHttpRequest(),
			responseType: 'json'
		});
	},
	//Signup request HTTP service
	signOut: (url, method) => {
		return Observable.ajax({
			url,
			method,
			headers: { 'Content-Type': 'application/json' },
			async: true,
			crossDomain: true,
			withCredentials: true,
			createXHR: () => new XMLHttpRequest(),
			responseType: 'json'
		});
	}
};

export default HttpService;
