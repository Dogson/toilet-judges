//@flow
import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

//Reducers
import mapReducer from "./views/map/MapReducer"
import {createStackNavigator} from "react-navigation";
import {Routes} from "./config/routes";

let reducer = combineReducers({mapReducer: mapReducer});

const store = createStore(reducer);

const Navigator = createStackNavigator(Routes);

class AppRoot extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <Navigator/>
                </View>
            </Provider>
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