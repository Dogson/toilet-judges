This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

## Compatibility

This project is currently only compatible with Android phones, version 5.0 or higher.

## Project initialization

#### Install all dependencies 

`npm i`

#### Set your API keys
This project uses **[Firebase](https://firebase.google.com/docs/)** and **[Google Places](https://developers.google.com/places/web-service/search)** APIs. Both need an API key to work. You must generate them and put them in   `/config/appConfig.js`

#### Install mobile environment

Install [expo](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) on your mobile phone

## Run project for development

####Run project

`npm start`

#### Use your phone to check the project in real time

Scan the QR code.

Shake your phone to access expo settings.

## Build and deploy project

https://docs.expo.io/versions/latest/distribution/building-standalone-apps

`expo build:android`

Wait for the build to finish, then get the generated APK.