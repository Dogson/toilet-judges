import {APP_CONFIG} from "../config/appConfig";
import {FetchHelper} from "../helpers/fetchHelper";

export class ToiletEndpoints {
    static getToiletById(id) {
        const url = APP_CONFIG.apiUrl + ''
        return FetchHelper.get(url)
            .then((response) => {
                return response.json()
                    .then((json) => {
                        return json;
                    });
            })
    }
}