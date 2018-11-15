//@flow
import React from 'react';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStore, combineReducers, connect} from 'redux';
import {Font} from "expo";

//Reducers
import homeReducer from "./components/views/home/HomeReducer"
import toiletReducer from "./components/views/toilet/ToiletReducer"
import authReducer from "./components/views/auth/AuthReducer";
import rootReducer from "./components/views/root/RootReducer";

//Components
import AppRedux from "./components/views/root/AppRedux"

let reducer = combineReducers({
    rootReducer: rootReducer,
    homeReducer: homeReducer,
    toiletReducer: toiletReducer,
    authReducer: authReducer
});

const store = createStore(reducer);

export class AppRoot extends React.Component<{}> {

    state = {
      fontsLoaded: false
    };

    componentDidMount(){
        Font.loadAsync({
            'garment-district': require('../assets/fonts/GarmentDistrict-Regular.otf'),
        })
            .then(() => {
                this.setState({fontsLoaded: true});
            });
    }

    render() {
        return <StoreProvider store={store}>
            <PaperProvider>
                {this.state.fontsLoaded ? <AppRedux/> : null}
            </PaperProvider>
        </StoreProvider>
    }
}

