import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import { MenuProvider } from 'react-native-popup-menu';
import {createStore, combineReducers, connect, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {Font} from "expo";
import {YellowBox} from 'react-native';
import _ from 'lodash';

//Reducers
import searchReducer from "./components/views/home/SearchReducer"
import toiletReducer from "./components/views/toilet/ToiletReducer"
import authReducer from "./components/views/auth/AuthReducer";
import rootReducer from "./components/views/root/RootReducer";

//Components
import AppRedux from "./components/views/root/AppRedux"

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

let reducer = combineReducers({
    rootReducer: rootReducer,
    searchReducer: searchReducer,
    toiletReducer: toiletReducer,
    authReducer: authReducer
});

const enhancer = compose(applyMiddleware(thunk));

export const store = createStore(reducer, enhancer);

export class AppRoot extends React.Component<{}> {

    state = {
      fontsLoaded: false
    };

    componentDidMount(){
        Font.loadAsync({
            'garment-district': require('../assets/fonts/GarmentDistrict-Regular.otf'),
            'roboto-regular': require('../assets/fonts/roboto/Roboto-Regular.ttf'),
            'roboto-medium': require('../assets/fonts/roboto/Roboto-Medium.ttf'),
            'roboto-bold': require('../assets/fonts/roboto/Roboto-Bold.ttf'),
            'roboto-light': require('../assets/fonts/roboto/Roboto-Light.ttf'),
        })
            .then(() => {
                this.setState({fontsLoaded: true});
            });
    }

    render() {
        return <StoreProvider store={store}>
            <PaperProvider>
                <MenuProvider backHandler>
                {this.state.fontsLoaded ? <AppRedux /> : null}
                </MenuProvider>
            </PaperProvider>
        </StoreProvider>
    }
}

