// LIBRAIRIES
import React from 'react';
import _ from 'lodash';
import {
    BackHandler,
    Text,
    ScrollView,
    View,
    Alert,
    StyleSheet,
    TouchableNativeFeedback,
    ActivityIndicator
} from 'react-native';
import {connect} from "react-redux";
import {Icon, Button} from 'react-native-elements';
import {GlobalStyles} from "../../../styles/styles";
import * as firebase from "firebase";
import {ACTIONS_AUTH} from "../auth/AuthActions";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {FormInput} from "../../widgets/form/FormInput";
import {ROUTE_NAMES, TRANSITIONS, UserProfileRoutes} from "../../../config/navigationConfig";

export default class EditEmailView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            email: firebase.auth().currentUser.email
        }
    }

    componentDidMount() {
        this.setState({email: firebase.auth().currentUser.email});
    }

    // HANDLING EVENTS


    // RENDERING COMPONENT
    render() {
        return <View style={{
            flex: 1,
            backgroundColor: 'white'
        }}>
            <Text>{this.state.email}</Text>
        </View>
    }

}

