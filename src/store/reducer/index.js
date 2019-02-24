import types from '../constants';

const initialState = {
    profile: {},
    isLoading: false,
    snackOpen: true,
    snackMessage: ''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SIGNUPSUCCESS: {
            return {
                ...state,
                profile: action.payload,
                isLoading: false,
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
};

export default reducer;