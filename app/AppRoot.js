//@flow
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

// Components
import Map from "./map/Map";

//Reducers
import mapReducer from "./map/MapReducer"

let reducer = combineReducers({mapReducer: mapReducer});

const store = createStore(reducer);

class AppRoot extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <Map />
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AppRoot;