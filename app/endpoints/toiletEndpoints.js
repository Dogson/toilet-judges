import * as firebase from "firebase";

export class ToiletEndpoints {

    static getToilet(toiletId) {
        return firebase.functions().httpsCallable('getToilet')({toiletId: toiletId})
            .then((result) => {
                return result && result.data;
            });
    }
}