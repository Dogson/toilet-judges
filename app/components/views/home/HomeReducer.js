import {ACTIONS_HOME} from "./HomeActions";

export default homeReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_HOME.SET_POSITION :
            return {
                ...state,
                position: action.value
            };
        case ACTIONS_HOME.SET_TOILETS_LIST :
            return {
                ...state,
                toiletsList: action.value || []
            };
        default:
            return state;
    }
}