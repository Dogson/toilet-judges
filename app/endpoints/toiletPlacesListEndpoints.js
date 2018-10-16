import {APP_CONFIG} from "../config/appConfig";

import {FetchHelper} from "../helpers/fetchHelper"

export class ToiletPlacesListEndpoints {
    static getAllPlaces() {
        const url = APP_CONFIG.apiUrl;
        const apiKey = "places";
        return FetchHelper.get({
            url: url,
            apiKey: apiKey
        })
            .then((response) => {
                return response.json()
                    .then((json) => {
                        return json;
                    });
            })
    }

    static getToiletsFromSearch(searchText) {
        if (!searchText) {
            return this.getAllPlaces();
        }
        const url = APP_CONFIG.apiUrl;
        const apiKey = "places";
        return FetchHelper.get({
            url: url,
            apiKey: apiKey,
            data: {
                q: searchText
            }
        })
            .then((response) => {
                return response.json()
                    .then((json) => {
                        return json;
                    });
            });
    }
}
