import types from '../constants';

const initialState = {
    profile: {},
    isLoading: false,
    snackOpen: true,
    snackMessage: '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SIGNUPSUCCESS: {
            return {
                ...state,
                isLoading: false,
                snackOpen: true,
                snackMessage: 'Email Created Successfully'
            }
        }
        default: {
            return {
                ...state,
            }
        }
    }
};

export default reducer;