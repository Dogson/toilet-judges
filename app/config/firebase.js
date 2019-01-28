import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";
import {APP_CONFIG} from "./appConfig";
require("firebase/functions");

// Initialize Firebase
const config = APP_CONFIG.firebase;

firebase.initializeApp(config);