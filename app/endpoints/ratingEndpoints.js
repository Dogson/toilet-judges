import {APP_CONFIG} from "../config/appConfig";
import * as firebase from "firebase";
import {AuthEndpoints} from "./authEndpoints";
import {ToiletEndpoints} from "./toiletEndpoints";
import {ERROR_TYPES} from "../config/errorTypes";

export class RatingEndpoints {

    static getRating(ratingId) {
        return firebase.database().ref('ratings/' + ratingId).once('value')
            .then((snapshot) => {
                if (snapshot.val()) {
                    return snapshot.val();
                }
            })
    }

    static createRating(rating) {
        delete rating.uid;
        let newRef = firebase.database().ref('ratings').push();
        let key = newRef.key;
        return newRef.set(rating)
            .then(() => {
                return key;
            });
    }

    static updateRating(rating) {
        let id = rating.uid;
        if (!rating.uid)
            return this.createRating(rating);
        delete rating.uid;
        return firebase.database().ref('ratings/' + id).set(rating)
            .then(() => {
                return id;
            });
    }


    static deleteRating(ratingId) {
        return firebase.database().ref('ratings/' + ratingId).remove();
    }

    static getUserRating(userRatingId) {
        let userRating;
        return firebase.database().ref('userRatings/' + userRatingId).once('value')
            .then((snapshot) => {
                if (snapshot.val()) {
                    userRating = snapshot.val();
                    return this.getRating(userRating.ratingId);
                }
            })
            .then((rating) => {
                userRating = {
                    isAccessible: userRating.isAccessible,
                    isMixed: userRating.isMixed,
                    rating: rating,
                    userId: userRating.userId,
                };
                return userRating;
            })
    }

    static createUserRating(toiletId, userRating) {
        let uRating = userRating;
        return this.createRating(userRating.rating)
            .then((ratingId) => {
                let userRating = {
                    isAccessible: uRating.isAccessible,
                    isMixed: uRating.isMixed,
                    ratingId: ratingId,
                    userId: firebase.auth().currentUser.uid,
                    toiletId: toiletId
                };
                return firebase.database().ref('userRatings').push().set(userRating);
            });

    }

    static updateUserRating(toiletId, userRating) {
        return this.getUserRating(userRating.uid).then((ur) => {
            if (ur && ur.userId === firebase.auth().currentUser.uid) {
                return this.updateRating({...userRating.rating, uid: userRating.ratingId})
                    .then((ratingId) => {
                        let userRatingUpdated = {
                            isAccessible: userRating.isAccessible,
                            isMixed: userRating.isMixed,
                            ratingId: ratingId,
                            userId: firebase.auth().currentUser.uid,
                            toiletId: toiletId
                        };
                        return firebase.database().ref('userRatings/' + userRating.uid).set(userRatingUpdated);
                    });
            }
        });
    }

    static deleteUserRating(userRatingId) {
        return firebase.database().ref('userRatings/' + userRatingId).once('value')
            .then((snapshot) => {
                const userRating = snapshot.val();
                if (userRating && userRating.userId === firebase.auth().currentUser.uid) {
                    return this.deleteRating(userRating.ratingId)
                        .then(() => {
                            return firebase.database().ref('userRatings/' + userRatingId).remove();
                        });
                }
                else {
                    return Promise.reject({code: ERROR_TYPES.INCORRECT_USER[1]});
                }
            })
    }


    static createUserReview(toiletId, userRating) {
        return ToiletEndpoints.createOrUpdateToilet({uid: toiletId})
            .then(() => {
                return firebase.database().ref('userRatings').orderByChild('userId').equalTo(firebase.auth().currentUser.uid).once('value')
                    .then((snapshot) => {
                        let userRatings = snapshot.val();
                        if (!userRatings)
                            return this.createUserRating(toiletId, userRating);
                        let ur = Object.keys(userRatings).map((key) => {
                            return {
                                ...userRatings[key],
                                uid: key
                            };
                        }).find((uRating) => {
                            return uRating.toiletId === toiletId;
                        });
                        if (!ur) {
                            return this.createUserRating(toiletId, userRating);
                        }
                        return this.updateUserRating(toiletId, userRating);
                    });
            })
            .then(() => {
                return ToiletEndpoints.updateToiletRating(toiletId);
            })
    }

    static updateUserReview(toiletId, userRating) {
        return ToiletEndpoints.createOrUpdateToilet({uid: toiletId})
            .then(() => {
                return this.updateUserRating(toiletId, userRating);
            })
            .then(() => {
                return ToiletEndpoints.updateToiletRating(toiletId);
            })
    }

    static deleteUserReview(toiletId, userRatingId) {
        return this.deleteUserRating(userRatingId)
            .then(() => {
                return ToiletEndpoints.updateToiletRating(toiletId)
            })
    }
}