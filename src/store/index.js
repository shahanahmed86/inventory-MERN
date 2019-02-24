import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import reducer from './reducer';
import epics from './epics';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(epicMiddleware)
    )
);

epicMiddleware.run(epics)

store.subscribe(() => console.log(store.getState()));

export default store;