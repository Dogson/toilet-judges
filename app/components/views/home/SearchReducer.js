import {ACTIONS_SEARCH} from "./SearchActions";

export default searchReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_SEARCH.SET_TOILETS_LIST :
            return {
                ...state,
                toiletsList: action.value || []
            };
        default:
            return state;
    }
}