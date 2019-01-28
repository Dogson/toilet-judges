import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";

export class ToiletEndpoints {

    static getToilet(toiletId) {
        return firebase.functions().httpsCallable('getToilet')({toiletId: toiletId})
            .then((result) => {
                return result && result.data;
            });
    }
}