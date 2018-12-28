import {APP_CONFIG} from "../config/appConfig";
import * as firebase from "firebase";
import {RatingEndpoints} from "./ratingEndpoints";

export class ToiletEndpoints {

    static getToilet(toiletId) {
        let toilet;
        return firebase.database().ref('toilets/' + toiletId).once('value')
            .then((snapshot) => {
                toilet = snapshot.val();
                if (!toilet) {
                    return toilet;
                }
                toilet.uid = toiletId;
                if (!toilet.ratingId) {
                    return toilet;
                }
                return firebase.database().ref('ratings/' + toilet.ratingId).once('value')
                    .then((snapshot2) => {
                        toilet.rating = snapshot2.val();

                        let userId = firebase.auth().currentUser.uid;
                        return firebase.database().ref('userRatings').orderByChild('userId').equalTo(userId).once('value')
                            .then((snapshot3) => {
                                let userRatings = snapshot3.val();
                                if (!userRatings)
                                    return toilet;
                                let userRating = Object.keys(userRatings).map((key) => {
                                    return {
                                        ...userRatings[key],
                                        uid: key
                                    };
                                }).find((userRating) => {
                                    return userRating.toiletId === toiletId;
                                });
                                if (!userRating)
                                    return toilet;
                                toilet.userRating = userRating;
                                return firebase.database().ref('ratings/' + userRating.ratingId).once('value')
                                    .then((snapshot4) => {
                                        let rating = snapshot4.val();
                                        toilet.userRating.rating = rating;
                                        return toilet;
                                    })

                            })
                    });
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    static createToilet(toilet) {
        let id = toilet.uid;
        delete toilet.uid;
        toilet.ratingCount = 0;
        return firebase.database().ref('toilets/' + id).set(toilet)
            .then(() => {
                return id;
            });
    }

    static createOrUpdateToilet(toilet) {
        let t = toilet;
        return firebase.database().ref('toilets/' + toilet.uid).once('value')
            .then((snapshot) => {
                let toilet = snapshot.val();
                if (toilet) {
                    let id = t.uid;
                    delete t.uid;
                    return firebase.database().ref('toilets/' + id).update(t);
                }
                else {
                    return this.createToilet(t);
                }
            });
    }


    static updateToiletRating(toiletId) {
        let userRatings;
        let isAccessibleCount = 0;
        let isMixedCount = 0;
        let ratingCount = 0;
        let globalRating = {
            global: 0,
            cleanliness: 0,
            functionality: 0,
            decoration: 0,
            value: 0
        };
        let toilet;
        return firebase.database().ref('userRatings').orderByChild('toiletId').equalTo(toiletId).once('value')
            .then((snapshot) => {
                let ratingArrays;
                userRatings = snapshot.val();
                if (userRatings) {
                    ratingArrays = Object.keys(userRatings).map((key) => {
                        return {
                            ...userRatings[key],
                            uid: key
                        };
                    });
                }
                else {
                    ratingArrays = [];
                }

                return Promise.all(ratingArrays.map((rating) => {
                    return RatingEndpoints.getRating(rating.ratingId)
                        .then((result) => {
                            return {
                                ...rating,
                                rating: result
                            }
                        });
                }));
            })
            .then((ratingArray) => {
                ratingArray.forEach((userRating) => {
                    let rating = userRating.rating;
                    if (rating && rating.global) {
                        ratingCount++;

                        globalRating = {
                            global: (globalRating.global * (ratingCount - 1) + rating.global) / ratingCount,
                            cleanliness: (globalRating.cleanliness * (ratingCount - 1) + rating.cleanliness) / ratingCount,
                            functionality: (globalRating.functionality * (ratingCount - 1) + rating.functionality) / ratingCount,
                            decoration: (globalRating.decoration * (ratingCount - 1) + rating.decoration) / ratingCount,
                            value: (globalRating.value * (ratingCount - 1) + rating.value) / ratingCount,
                        }
                    }

                    if (userRating.isMixed != null) {
                        isMixedCount = userRating.isMixed ? isMixedCount + 1 : isMixedCount - 1;
                    }
                    if (userRating.isAccessible != null) {
                        isAccessibleCount = userRating.isAccessible ? isAccessibleCount + 1 : isAccessibleCount - 1;
                    }
                });
                return this.getToilet(toiletId);
            })
            .then((result) => {
                toilet = result;
                globalRating.uid = toilet.ratingId;
                if (ratingCount > 0) {
                    return RatingEndpoints.updateRating(globalRating)
                        .then((ratingId) => {
                            let updatedToilet = {
                                uid: toilet.uid,
                                isAccessible: ratingCount > 0 && isAccessibleCount !== 0 ? isAccessibleCount > 0 : null,
                                isMixed: ratingCount > 0 && isMixedCount !== 0 ? isMixedCount > 0 : null,
                                ratingId: ratingId,
                                ratingCount: ratingCount
                            };
                            return this.createOrUpdateToilet(updatedToilet);
                        })
                }
                else {
                    return RatingEndpoints.deleteRating(globalRating.uid)
                        .then(() => {
                            let updatedToilet = {
                                uid: toilet.uid,
                                isAccessible: ratingCount > 0 && isAccessibleCount !== 0 ? isAccessibleCount > 0 : null,
                                isMixed: ratingCount > 0 && isMixedCount !== 0 ? isMixedCount > 0 : null,
                                ratingCount: 0
                            };
                            return this.createOrUpdateToilet(updatedToilet);
                        })
                }
            })

    }
}