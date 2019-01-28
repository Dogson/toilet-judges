import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";

export class RatingEndpoints {

    static createUserReview(toiletId, userRating) {
        return firebase.functions().httpsCallable('createUserReview')({toiletId: toiletId, userRating: userRating});
    }

    static updateUserReview(toiletId, userRating) {
        return firebase.functions().httpsCallable('updateUserReview')({toiletId: toiletId, userRating: userRating});
    }

    static deleteUserReview(toiletId, userRatingId) {
        return firebase.functions().httpsCallable('deleteUserReview')({toiletId: toiletId, userRatingId: userRatingId});
    }
}