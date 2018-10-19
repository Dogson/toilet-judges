//@flow
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {createStore, combineReducers} from 'redux';

//Reducers
import homeReducer from "./components/views/home/HomeReducer"
import toiletReducer from "./components/views/toilet/ToiletReducer"
import {createStackNavigator} from "react-navigation";
import {Routes} from "./config/routes";

let reducer = combineReducers({homeReducer: homeReducer, toiletReducer: toiletReducer});

const store = createStore(reducer);

const Navigator = createStackNavigator(Routes);

class AppRoot extends React.Component<{}> {
    render() {
        return (
            <StoreProvider store={store}>
                <PaperProvider>
                    <View style={styles.container}>
                        <Navigator/>
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