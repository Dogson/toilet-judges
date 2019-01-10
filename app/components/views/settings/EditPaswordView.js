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
import {AuthEndpoints} from "../../../endpoints/authEndpoints";
import {ERROR_TYPES} from "../../../config/errorTypes";

export default class EditPaswordView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            isReady: true,
            oldPasswordErrorMessage: null,
            newPasswordErrorMessage: null,
            hasSubmitted: false
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.hasSubmitted && (prevState.oldPassword !== this.state.oldPassword || prevState.newPassword !== this.state.newPassword)) {
            this.validateForm();
        }
    }


    // HANDLING EVENTS
    _handleChangeOldPassword(text) {
        this.setState({oldPassword: text});
    }

    _handleChangeNewPassword(text) {
        this.setState({newPassword: text});
    }

    _handlePressSubmitButton() {
        let _this = this;
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            this.setState({isReady: false});
            AuthEndpoints.login(firebase.auth().currentUser.email, this.state.oldPassword)
                .then(() => {
                    return firebase.auth().currentUser.updatePassword(this.state.newPassword)
                })
                .then(() => {
                    _this.setState({hasSubmitted: false});
                    _this.props.navigation.goBack(null);
                })
                .catch((error) => {
                    if (ERROR_TYPES.USER_NOT_FOUND.indexOf(error.code) > -1) {
                        this.setState({oldPasswordErrorMessage: "Votre mot de passe actuel est incorrect"});
                    }
                    else if (ERROR_TYPES.WEAK_PASSWORD.indexOf(error.code) > -1) {
                        this.setState({newPasswordErrorMessage: "Le mot de passe n'est pas assez sécurisé"});
                    }
                    else {
                        Alert.alert("Une erreur est survenue.")
                        console.log(error);
                    }
                    this.setState({isReady: true});
                })
        }
    }

    //FORM VALIDATION
    validateForm() {
        let oldPasswordErrorMessage = null;
        let newPasswordErrorMessage = null;
        let isValid = true;
        if (!this.state.oldPassword || this.state.oldPassword.length < 1) {
            oldPasswordErrorMessage = "Veuillez entrer votre mot de passe actuel";
            isValid = false;
        }
        if (!this.state.newPassword || this.state.newPassword.length < 1) {
            newPasswordErrorMessage = "Veuillez entrer votre nouveau mot de passe";
            isValid = false;
        }
        this.setState({
            oldPasswordErrorMessage: oldPasswordErrorMessage,
            newPasswordErrorMessage: newPasswordErrorMessage
        });
        return isValid;
    }

    // RENDERING COMPONENT
    render() {
        return <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 15
        }}>
            <View>
                <Text style={[GlobalStyles.titleText, {paddingBottom: 20}]}>
                    Modifier votre mot de passe
                </Text>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View>
                    <Text style={GlobalStyles.secondaryText}>Votre mot de passe actuel</Text>
                    <FormInput value={this.state.oldPassword}
                               onChangeText={(text) => this._handleChangeOldPassword(text)}
                               placeholder="**********"
                               errorMessage={this.state.oldPasswordErrorMessage}
                               secureTextEntry={true}></FormInput>
                </View>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View>
                    <Text style={GlobalStyles.secondaryText}>Votre nouveau mot de passe</Text>
                    <FormInput value={this.state.newPassword}
                               onChangeText={(text) => this._handleChangeNewPassword(text)}
                               placeholder="**********"
                               errorMessage={this.state.newPasswordErrorMessage}
                               secureTextEntry={true}></FormInput>
                </View>
            </View>
            <Button title="MODIFIER LE MOT DE PASSE"
                    onPress={() => this._handlePressSubmitButton()}
                    buttonStyle={GlobalStyles.primaryButton}
                    titleStyle={GlobalStyles.defaultFont}
                    loading={!this.state.isReady}
            ></Button>
        </View>
    }

}

