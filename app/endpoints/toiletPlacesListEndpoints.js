import {APP_CONFIG} from "../config/appConfig";

import {FetchHelper} from "../helpers/fetchHelper"

export class ToiletPlacesListEndpoints {
    static getAllPlaces() {
        const url = APP_CONFIG.apiUrl;
        const apiKey = "places";

        let status;
        return FetchHelper.get({
            url: url,
            apiKey: apiKey
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
    }
}