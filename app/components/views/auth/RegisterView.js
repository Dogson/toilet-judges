// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {View, Image, Text, Alert, ScrollView, StatusBar, TouchableNativeFeedback} from "react-native";
import {Button, Icon} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// CONST
import {ACTIONS_AUTH} from "./AuthActions";
import {ACTIONS_ROOT} from "../root/RootActions";

const TOILET_LOGO = require('../../../../assets/img/toiletLogo.png');


// API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";
import {GlobalStyles} from "../../../styles/styles";

//COMPONENTS
import {FormInput} from "../../widgets/form/FormInput";
import {ERROR_TYPES} from "../../../config/errorTypes";
import {ROUTE_NAMES} from "../../../config/navigationConfig";
import {STYLE_VAR} from "../../../styles/stylingVar";

class RegisterView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emailErrorMessage: null,
            passwordErrorMessage: null,
            registerScreen: false,
            isReady: true
        };

        this._handlePressSubmitButton = this._handlePressSubmitButton.bind(this);
        this._handleChangeEmail = this._handleChangeEmail.bind(this);
        this._handleChangePassword = this._handleChangePassword.bind(this);
        this._handleChangeUsername = this._handleChangeUsername.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.state.hasSubmitted && (prevProps.email !== this.props.email || prevProps.password !== this.props.password || prevProps.username !== this.props.username)) {
            this.validateForm();
        }
    }

    //EVENTS
    _handleChangeEmail(text) {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: text});
    }

    _handleChangePassword(text) {
        this.props.dispatch({type: ACTIONS_AUTH.PASSWORD_FIELD_CHANGE, value: text});
    }

    _handleChangeUsername(text) {
        this.props.dispatch({type: ACTIONS_AUTH.USERNAME_FIELD_CHANGE, value: text});
    }

    _handlePressSubmitButton() {
        let _this = this;
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            this.setState({isReady: false});

            AuthEndpoints.register(_this.props.email, _this.props.username, _this.props.password).then(() => {
                this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: null});
                this.props.dispatch({type: ACTIONS_AUTH.PASSWORD_FIELD_CHANGE, value: null});
                this.props.dispatch({type: ACTIONS_AUTH.USERNAME_FIELD_CHANGE, value: null});
            }).catch((error) => {
                if (ERROR_TYPES.USER_EXISTS.indexOf(error.code) > -1) {
                    this.setState({passwordErrorMessage: "Cette adresse e-mail est déja associée à un compte."});
                }
                else {
                    Alert.alert("Une erreur est survenue.")
                }
                _this.setState({isReady: true});

            });

        }
    }

    _handlePressSwitch() {
        this.props.navigation.goBack(null);
    }

    // FORM VALIDATION
    validateForm() {
        let emailErrorMessage = null;
        let passwordErrorMessage = null;
        let usernameErrorMessage = null;
        let isValid = true;
        let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regEmail.test(this.props.email)) {
            emailErrorMessage = "Veuillez entrer une adresse e-mail valide";
            isValid = false;
        }
        if (!this.props.password || this.props.password.length < 7) {
            passwordErrorMessage = "Le mot de passe doit contenir au moins 6 caractères";
            isValid = false;
        }
        if (!this.props.password || this.props.password.length < 1) {
            passwordErrorMessage = "Veuillez entrer un mot de passe";
            isValid = false;
        }
        if (!this.props.username || this.props.username.length < 1) {
            usernameErrorMessage = "Veuillez entrer un nom d'utilisateur";
            isValid = false;
        }
        this.setState({
            emailErrorMessage: emailErrorMessage,
            passwordErrorMessage: passwordErrorMessage,
            usernameErrorMessage: usernameErrorMessage
        });
        return isValid;
    }

    // RENDER COMPONENTS
    renderLogo() {
        return <View style={[GlobalStyles.flexColumnCenter, {marginBottom: 20}]}>
            <Image
                style={{marginLeft: 30, width: 80, height: 80}}
                source={TOILET_LOGO}
            />
            <Text style={GlobalStyles.logoText}>
                toilet advisor
            </Text>
        </View>
    }

    renderLoginSwitchButton() {
        return <View style={{marginTop: 50}}>
            <Text
                style={[GlobalStyles.secondaryText, {alignSelf: 'center', marginBottom: 5}]}>Vous possédez déja un
                compte ?</Text>
            <Button title="SE CONNECTER"
                    onPress={() => this._handlePressSwitch()}
                    buttonStyle={GlobalStyles.secondaryButton}
                    titleStyle={GlobalStyles.secondaryButtonTitle}
            ></Button>
        </View>
    }

    renderGoBackButton() {
        return <TouchableNativeFeedback onPress={() => {
            this._handlePressSwitch()
        }}>
            <View style={{position: 'absolute', left: 0, top: StatusBar.currentHeight, padding: 15}}>
                <Icon name="arrow-back" color={STYLE_VAR.text.color.primary}></Icon>
            </View>
        </TouchableNativeFeedback>
    }

    render() {
        return <View>
            {this.renderGoBackButton()}
            <ScrollView style={[GlobalStyles.withMarginContainer, {marginVertical: 50}]}
                        keyboardShouldPersistTaps="handled">
                {this.renderLogo()}
                <FormInput label="E-mail"
                           value={this.props.email}
                           onChangeText={(text) => this._handleChangeEmail(text)}
                           placeholder="toilette@alaturc.com"
                           errorMessage={this.state.emailErrorMessage}
                           keyboardType="email-address"
                           autoCapitalize="none"></FormInput>
                <FormInput label="Nom d'utilisateur"
                           value={this.props.username}
                           onChangeText={(text) => this._handleChangeUsername(text)}
                           placeholder="Mr. Hankey"
                           errorMessage={this.state.usernameErrorMessage}
                ></FormInput>
                <FormInput label="Mot de passe"
                           value={this.props.password}
                           onChangeText={(text) => this._handleChangePassword(text)}
                           placeholder="**********"
                           errorMessage={this.state.passwordErrorMessage}
                           secureTextEntry={true}></FormInput>
                <Button title="S'INSCRIRE"
                        onPress={() => this._handlePressSubmitButton()}
                        buttonStyle={GlobalStyles.primaryButton}
                        titleStyle={GlobalStyles.defaultFont}
                        loading={!this.state.isReady}></Button>
                {this.renderLoginSwitchButton()}

                <KeyboardSpacer/>
            </ScrollView>
        </View>
    }


}

function mapStateToProps(state) {
    return {
        password: state.authReducer.password,
        email: state.authReducer.email,
        username: state.authReducer.username
    };
}

export default connect(mapStateToProps)(RegisterView);
