import {APP_CONFIG} from "../config/appConfig";

export class ToiletsEndpoints {
    static getAllToilets() {
        return fetch(APP_CONFIG.apiUrl + '/toilets/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
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
            return this.getAllToilets();
        }
        const fetchUrl = APP_CONFIG.apiUrl+'/toilets?q='+encodeURIComponent(searchText);
        return fetch(fetchUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
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
