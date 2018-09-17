//@flow
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

// const reducer = combineReducers(reducers);
function reducer(state = {}, action) {
    return state;
}

const store = createStore(reducer);

export default class App extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    <Text>Nibber</Text>
                </View>
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
