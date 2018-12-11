import {ACTIONS_ROOT} from "./RootActions";
import {AsyncStorage} from "react-native";

export default rootReducer = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS_ROOT.LOGOUT :
            let keys = ['user'];
            AsyncStorage.multiRemove(keys);
            return {
                ...state,
                user: null,
                isLoggedId: false
            };
        case ACTIONS_ROOT.LOGIN :
            const user = action.user;

            // Save token and data to Asyncstorage
            AsyncStorage.multiSet([
                ['user', JSON.stringify(user)]
            ]);

            return {
                ...state,
                user: action.user,
                isLoggedIn: true
            };
        default:
            return state;
    }
};
