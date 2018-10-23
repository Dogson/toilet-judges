import {ACTIONS_ROOT} from "./RootActions";

export default rootReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_ROOT.DELETE_JWT :
            return {
                ...state,
                jwt: ''
            };
        case ACTIONS_ROOT.SET_JWT :
            return {
                ...state,
                jwt: action.value
            };
        default:
            return state;
    }
};
