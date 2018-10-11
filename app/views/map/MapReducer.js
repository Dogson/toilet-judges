import {ACTIONS_MAPS} from "./MapActions"

export default mapReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_MAPS.SET_POSITION :
            return {
                ...state,
                position: action.value
            };
        case ACTIONS_MAPS.SET_TOILETS_LIST :
            return {
                ...state,
                toiletsList: action.value
            };
        default:
            return state;
    }
}