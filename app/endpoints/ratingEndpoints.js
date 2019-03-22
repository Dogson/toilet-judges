import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";
import {ToiletEndpoints} from "./toiletEndpoints";

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

    static getCurrentUserReviews() {
        return this.getUserReviews(firebase.auth().currentUser.uid);
    }

    static getUserReviews(userId) {
       return firebase.functions().httpsCallable('getUserReviews')({userId})
           .then((result) => {
               const userRatings = result.data;
               return Promise.all(userRatings.map((userRating) => {
                   return ToiletEndpoints.getPlaceById(userRating.toiletId)
                       .then((result) => {
                           userRating.toilet = result;
                           return userRating;
                       })
               }))
           });
    }
}