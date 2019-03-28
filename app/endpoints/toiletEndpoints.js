import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";
import {APP_CONFIG} from "../config/appConfig";

export class ToiletEndpoints {

    static getToilet(toiletId) {
        return firebase.functions().httpsCallable('getToilet')({toiletId: toiletId})
            .then((result) => {
                return result && result.data;
            });
    }

    static getPlaceById(id) {
        return fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + id + '&key=' + APP_CONFIG.GooglePlaceAPIkey, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                return response.json()
                    .then((result) => {
                        return {
                            name: result.result.name,
                            address: result.result.formatted_address
                        };
                    })
            });
    }

    static getToiletReviews(toiletId, lastLoadedReview) {
        return firebase.functions().httpsCallable('getToiletReviews')({toiletId, lastLoadedReview})
            .then((result) => {
                return result && result.data;
            });
    }
}