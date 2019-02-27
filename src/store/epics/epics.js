import 'rxjs/Rx';
import { Observable } from 'rxjs';
import axios from 'axios';

import types from '../constants';
import actions from '../actions';

const epics = {
    signup: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        axios.post('http://localhost:8080/user/signup', payload)
            .then(res => {
                console.log(res.data);
            })
            .catch(error => console.log(error));
        return Observable.of(
            actions.signUpSuccess(payload)
        );
    }),
    signin: action$ => action$.ofType(types.SIGNIN).switchMap(({ payload }) => {
        axios.post('http://localhost:8080/user/signin', payload)
            .then(res => {
                localStorage.setItem('Token', JSON.stringify(res.data));
            })
            .catch(error => console.log(error));
        return Observable.of(
            actions.signInSuccess(payload)
        );
    }),
};

export default epics;