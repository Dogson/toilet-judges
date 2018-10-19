//@flow
import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStore, combineReducers} from 'redux';
import {createStackNavigator} from "react-navigation";

//Reducers
import homeReducer from "./components/views/home/HomeReducer"
import toiletReducer from "./components/views/toilet/ToiletReducer"
import authReducer from "./components/views/auth/AuthReducer";

//Const
import {Routes} from "./config/routes";

//Components
import LoginView from "./components/views/auth/LoginView";
import {DeviceStorage} from "./helpers/deviceStorage";

let reducer = combineReducers({homeReducer: homeReducer, toiletReducer: toiletReducer, authReducer: authReducer});

const store = createStore(reducer);

const Navigator = createStackNavigator(Routes);

class AppRoot extends React.Component<{}> {
    constructor() {
        super();
        this.state = {
            jwt: '',
            loading: true
        };

        this.newJWT = this.newJWT.bind(this);
        this.deleteJWT = DeviceStorage.deleteJWT.bind(this);
        this.loadJWT = DeviceStorage.loadJWT.bind(this);

        this.loadJWT();
    }

    newJWT(jwt){
        this.setState({
            jwt: jwt
        });
    }

    render() {
        let body;
        if (this.state.loading) {
            body = <ActivityIndicator></ActivityIndicator>
        }
        else if (!this.state.jwt) {
           body = <LoginView newJWT={this.newJWT}/>
        }
        else body = <Navigator/>;
        return (
            <StoreProvider store={store}>
                <PaperProvider>
                    <View style={styles.container}>
                        {body}
                    </View>
                </PaperProvider>
            </StoreProvider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default AppRoot;