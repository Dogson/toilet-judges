import {ACTIONS_AUTH} from "./AuthActions";

export default authReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_AUTH.LOG_IN :
            return {
                ...state,
                newJWT: action.value
            };
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
        default:
            return state;
    }
}