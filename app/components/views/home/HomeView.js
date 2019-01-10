// LIBRAIRIES
import React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback, Image} from "react-native";

// CONST
import {APP_CONFIG} from "../../../config/appConfig";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";
const TOILET_WELCOME = require('../../../../assets/img/toiletWelcome.png');

// API ENDPOINTS
import {GlobalStyles} from "../../../styles/styles";

//COMPONENTS
import {SearchBar} from "react-native-elements";

export default class HomeView extends React.Component {
    constructor(props) {
        super(props);

        this._handleSearchPress = this._handleSearchPress.bind(this);

    }

    _handleSearchPress() {
        this.props.navigation.navigate(ROUTE_NAMES.SEARCH, {
            transition: TRANSITIONS.FROM_BOTTOM
        })
    }


    render() {
        return <View style={[GlobalStyles.flexColumnCenter, {flex: 1, marginBottom: 170}]}>
            <View style={{paddingVertical: 20}}>
                <Image
                    style={{width: 80, height: 80, alignSelf: 'center'}}
                    source={TOILET_WELCOME}
                />
                <Text style={GlobalStyles.secondaryText}>
                    Votre prochain havre de paix
                </Text>
            </View>
            <TouchableNativeFeedback onPress={this._handleSearchPress}>
                <View style={styles.search}>
                    <SearchBar
                        platform={APP_CONFIG.platform}
                        placeholder='Rechercher un restaurant, bar...'
                        inputStyle={GlobalStyles.primaryText}
                        editable={false}
                        containerStyle={{borderRadius: 5}}/>
                </View>
            </TouchableNativeFeedback>
        </View>
    }
}

const styles = StyleSheet.create({
    search: {
        width: '95%',
        marginVertical: 5
    }
});