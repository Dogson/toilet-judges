import {ACTIONS_AUTH} from "./AuthActions";

export default authReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_AUTH.PASSWORD_FIELD_CHANGE :
            return {
                ...state,
                password: action.value
            };
        case ACTIONS_AUTH.EMAIL_FIELD_CHANGE :
            return {
                ...state,
                email: action.value
            };
        case ACTIONS_AUTH.USERNAME_FIELD_CHANGE :
            return {
                ...state,
                username: action.value
            };
        default:
            return state;
    }
}