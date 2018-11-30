import {APP_CONFIG} from "../config/appConfig";
import {FetchHelper} from "../helpers/fetchHelper";

export class ToiletEndpoints {

    static getAllToilets() {
        const url = APP_CONFIG.apiUrl;
        const apiKey = "toilets";

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
            return this.getAllToilets();
        }
        const url = APP_CONFIG.apiUrl;
        const apiKey = "toilets";
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


    static getToilet(toiletId) {
        const url = APP_CONFIG.apiUrl;
        const apiKey = "toilets";
        return FetchHelper.get({
            url: url,
            apiKey: apiKey,
            id: toiletId
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
            }).catch((err) => {
                console.log(err);
            })
    }

    static rateToilet(toiletId, userRating) {
        const url = APP_CONFIG.apiUrl;
        let apiKey = "rating";
        if (userRating._id) {
            apiKey += "/" + userRating._id;
        }
        return FetchHelper.post({
            url: url,
            apiKey: apiKey,
            data: {
                toiletId: toiletId,
                userRating: userRating
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
            }).catch((err) => {
                console.log(err);
            });
    }

    static deleteUserReview(userRatingId) {
        const url = APP_CONFIG.apiUrl;
        let apiKey = "rating/" + userRatingId;

        return FetchHelper.delete({
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
            }).catch((err) => {
                console.log(err);
            });
    }
}