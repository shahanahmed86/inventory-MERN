import 'rxjs/Rx';
import { Observable } from 'rxjs';
import axios from 'axios';

import types from '../constants';
import actions from '../actions';

const epics = {
    signup: action$ => action$.ofType(types.SIGNUP).switchMap(({ payload }) => {
        axios.post('http://localhost:8080/user/signup', payload);
        return Observable.of(
            actions.signUpSuccess(payload)
        );
    }),
};

export default epics;