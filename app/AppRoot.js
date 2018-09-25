//@flow
import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

// Components
import Map from "./views/map/Map";

//Reducers
import mapReducer from "./views/map/MapReducer"

let reducer = combineReducers({mapReducer: mapReducer});

const store = createStore(reducer);

class AppRoot extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <Map/>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop: StatusBar.currentHeight
    }
});

export default AppRoot;