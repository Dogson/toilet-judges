import {ACTIONS_TOILET} from "./ToiletActions"

export default toiletReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_TOILET.START_LOADING:
            return {
                ...state,
                isReady: false
            };
        case ACTIONS_TOILET.SET_TOILETS :
            return {
                ...state,
                toilets: action.value
            };
        case ACTIONS_TOILET.SET_CURRENT_TOILET :
            return {
                ...state,
                currentToiletIndex: action.value,
                isReady: true
            };
        default:
            return state;
    }
}