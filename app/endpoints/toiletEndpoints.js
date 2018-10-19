import {APP_CONFIG} from "../config/appConfig";
import {FetchHelper} from "../helpers/fetchHelper";

export class ToiletEndpoints {
    static getToilets(toiletPlaceId) {
        const url = APP_CONFIG.apiUrl;
        const apiKey = "toilets";
        return FetchHelper.get({
            url: url,
            apiKey: apiKey,
            data: {
                toiletPlaceId: toiletPlaceId
            }
        })
            .then((response) => {
                return response.json()
                    .then((json) => {
                        return json;
                    });
            })
    }
}