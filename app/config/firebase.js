import * as firebase from 'firebase';
import {APP_CONFIG} from "./appConfig";

// Initialize Firebase
const config = APP_CONFIG.firebase;

firebase.initializeApp(config);

export const database = firebase.database();
export const auth = firebase.auth();
export const provider = new firebase.auth.FacebookAuthProvider();
export const storage = firebase.storage();