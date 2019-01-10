import {auth, database} from "../config/firebase";
import {ACTIONS_ROOT} from "../components/views/root/RootActions";

import {store} from '../AppRoot'
import {ACTIONS_AUTH} from "../components/views/auth/AuthActions";

export class AuthEndpoints {

    static login(email, password) {
        return new Promise((resolve, reject) => {
            auth.signInWithEmailAndPassword(email, password)
                .then((data) => {
                    //Get the user object from the realtime database
                    let {user} = data;
                    database.ref('users').child(user.uid).once('value')
                        .then((snapshot) => {
                            const exists = (snapshot.val() !== null);

                            //if the user exist in the DB, replace the user variable with the returned snapshot
                            if (exists) user = snapshot.val();
                            store.dispatch({type: ACTIONS_ROOT.LOGIN, user});
                            resolve({exists, user});
                        })
                        .catch((error) => reject(error));
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static register(email, username, password) {
        return new Promise((resolve, reject) => {
            let user;
            auth.createUserWithEmailAndPassword(email, password)
                .then((data) => {
                    user = {username, uid: data.user.uid};
                    return data.user.updateProfile({displayName: username});
                })
                .then(() => {
                    this.createUser(user)
                }).catch((error) => {
                    console.log(error);
                reject(error);
            });
        });

    }

    //Send Password Reset Email
    static resetPassword(email) {
        return new Promise((resolve, reject) => {
            auth.sendPasswordResetEmail(email)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    }

    //Sign log out
    static logout() {
        return new Promise((resolve, reject) => {
            auth.signOut()
                .then(() => {
                    store.dispatch({type: ACTIONS_ROOT.LOGOUT});
                    resolve()
                })
                .catch((error) => reject(error));
        });
    }

    static createUser(user) {
        return new Promise((resolve, reject) => {
            const userRef = database.ref().child('users');

            userRef.child(user.uid).update({...user})
                .then(() => {
                    resolve(user);
                    store.dispatch({type: ACTIONS_ROOT.LOGIN, user});
                    store.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: null});
                    store.dispatch({type: ACTIONS_AUTH.PASSWORD_FIELD_CHANGE, value: null});
                    store.dispatch({type: ACTIONS_AUTH.USERNAME_FIELD_CHANGE, value: null});
                })
                .catch((error) => reject({message: error}));
        });
    }

    static checkLoginStatus(callback) {
        auth.onAuthStateChanged((user) => {
            let isLoggedIn = (user !== null);

            if (isLoggedIn) {
                //Get the user object from the realtime database
                database.ref('users').child(user.uid).once('value')
                    .then((snapshot) => {

                        const exists = (snapshot.val() !== null);

                        //if the user exist in the DB, replace the user variable with the returned snapshot
                        if (exists) {
                            user = snapshot.val();
                            store.dispatch({type: ACTIONS_ROOT.LOGIN, user});
                        }
                        callback(exists, isLoggedIn);
                    })
                    .catch((error) => {
                        //unable to get user
                        store.dispatch({type: ACTIONS_ROOT.LOGOUT});
                        callback(false, false);
                    });
            } else {
                store.dispatch({type: ACTIONS_ROOT.LOGOUT});
                callback(false, isLoggedIn)
            }
        });
    }

}