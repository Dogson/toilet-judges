//@flow
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import Map from "./map/Map";

// const reducer = combineReducers(reducers);
function reducer(state = {}, action) {
    return state;
}

const store = createStore(reducer);

export default class AppRoot extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <Map/>
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
