import { Observable } from 'rxjs/Rx';

// const api = 'http://localhost:8080/api'
const api = 'https://inventory-app-mern.herokuapp.com/api'

const HttpService = {
	//Post request HTTP service
	post: (apiCall, method, body) => {
		const url = api + apiCall;
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
	get: (apiCall, method) => {
		const url = api + apiCall;
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
	put: (apiCall, method, body) => {
		const url = api + apiCall;
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
	delete: (apiCall, method) => {
		const url = api + apiCall;
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
	signUp: (apiCall, method, body) => {
		const url = api + apiCall;
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
	signOut: (apiCall, method) => {
		const url = api + apiCall;
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
