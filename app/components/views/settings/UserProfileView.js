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

export default class UserProfileView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            email: firebase.auth().currentUser.email,
            username: firebase.auth().currentUser.displayName
        };
        this._handlePressEditEmail = this._handlePressEditEmail.bind(this);
        this._handlePressEditUsername = this._handlePressEditUsername.bind(this);
        this._handlePressEditPassword = this._handlePressEditPassword.bind(this);
        this._handleFinishEditingEmail = this._handleFinishEditingEmail.bind(this);
    }

    // HANDLING EVENTS
    _handlePressEditEmail() {
        this.props.navigation.navigate(ROUTE_NAMES.EDIT_EMAIL, {
            transition: TRANSITIONS.FROM_BOTTOM,
            onFinishEditing: this._handleFinishEditingEmail
        })
    }

    _handleFinishEditingEmail(email) {
        this.setState({email: email});
    }

    _handlePressEditUsername() {

    }

    _handlePressEditPassword() {

    }

    // RENDERING COMPONENT
    render() {
        return <View style={{
            flex: 1,
            backgroundColor: 'white'
        }}>
            <ScrollView style={{flex: .8}}>
                <TouchableNativeFeedback onPress={this._handlePressEditEmail}>
                    <View style={[GlobalStyles.flexRow, GlobalStyles.sectionContainer, {alignItems: 'center'}]}>
                        <View style={[GlobalStyles.flexColumn, {flex: 0.9}]}>
                            <View>
                                <Text style={GlobalStyles.secondaryText}>Adresse e-mail</Text>
                                <Text style={GlobalStyles.primaryText}>{this.state.email}</Text>
                            </View>
                        </View>
                        <View style={{flex: 0.1}}>
                            <Icon name="edit" color={STYLE_VAR.text.color.primary}></Icon>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this._handlePressEditUsername}>
                    <View style={[GlobalStyles.flexRow, GlobalStyles.sectionContainer, {alignItems: 'center'}]}>
                        <View style={[GlobalStyles.flexColumn, {flex: 0.9}]}>
                            <View>
                                <Text style={GlobalStyles.secondaryText}>Nom d'utilisateur</Text>
                                <Text style={GlobalStyles.primaryText}>{this.state.username}</Text>
                            </View>
                        </View>

                        <View style={{flex: 0.1}}>
                            <Icon name="edit" color={STYLE_VAR.text.color.primary}></Icon>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={this._handlePressEditPassword}>
                    <View style={[GlobalStyles.flexRow, GlobalStyles.sectionContainer, {alignItems: 'center'}]}>
                        <View style={[GlobalStyles.flexColumn, {flex: 0.9}]}>
                            <View>
                                <Text style={GlobalStyles.secondaryText}>Mot de passe</Text>
                                <Text style={GlobalStyles.primaryText}>*********</Text>
                            </View>
                        </View>

                        <View style={{flex: 0.1}}>
                            <Icon name="edit" color={STYLE_VAR.text.color.primary}></Icon>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </ScrollView>
        </View>
    }

}

