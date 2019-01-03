import {APP_CONFIG} from "../config/appConfig";
import * as firebase from "firebase";
import {RatingEndpoints} from "./ratingEndpoints";

export class ToiletEndpoints {

    static getToilet(toiletId) {
        return firebase.functions().httpsCallable('getToilet')({toiletId: toiletId})
            .then((result) => {
                return result && result.data;
            });
    }
}