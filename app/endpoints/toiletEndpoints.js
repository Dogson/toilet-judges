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
                status = response.status;
                return response.json()
            })
            .then((data) => {
                if (status === 200) {
                    return data;
                }
                else {
                    return Promise.reject(data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}