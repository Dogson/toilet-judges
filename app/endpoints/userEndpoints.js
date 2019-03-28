import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";
require('../config/firebase');

export class UserEndpoints {
   static setUserName(username) {
       return firebase.auth().currentUser.updateProfile({displayName: username})
           .then(() => {
               return firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({username: username})
           })
   }
}
