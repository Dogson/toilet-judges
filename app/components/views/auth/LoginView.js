// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {View, Image, Text, Alert} from "react-native";
import {Button} from 'react-native-elements';
import {DeviceStorage} from "../../../helpers/deviceStorage";
import KeyboardSpacer from 'react-native-keyboard-spacer';


// CONST
import {ACTIONS_AUTH} from "./AuthActions";
import {ACTIONS_ROOT} from "../root/RootActions";

const TOILET_LOGO = require('../../../../assets/img/toiletLogo.png');


// API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";
import {GlobalStyles} from "../../../styles/styles";

//COMPONENTS
import {FormInput} from "../../form/FormInput";
import {ERROR_TYPES} from "../../../config/errorTypes";

class LoginView extends React.Component {
    constructor(props) {
        super(props);

        this.handlePressLoginButton = this.handlePressLoginButton.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleKeyboardSpacerToggle = this.handleKeyboardSpacerToggle.bind(this);

        this.state = {
            emailErrorMessage: null,
            passwordErrorMessage: null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.hasSubmitted && (prevProps.email !== this.props.email || prevProps.password !== this.props.password)) {
            this.validateForm();
        }
    }


    //EVENTS
    handleChangeEmail(text) {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: text});
    }

    handleChangePassword(text) {
        this.props.dispatch({type: ACTIONS_AUTH.PASSWORD_FIELD_CHANGE, value: text});
    }

    handlePressLoginButton() {
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            AuthEndpoints.login(this.props.email, this.props.password).then((data) => {
                if (data.errorType === ERROR_TYPES.WRONG_CRED) {
                    this.setState({passwordErrorMessage: "Votre email/mot de passe est incorrect"});
                    return false;
                }
                DeviceStorage.saveJWT(data.token).then(() => {
                    this.setState({hasSubmitted: false});
                    this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: data.token});
                });
            }).catch((error) => {
                console.log(error);
                Alert.alert("Une erreur est survenue.")
            })
        }

    }

    handlePressRegisterButton() {

    }

    handleKeyboardSpacerToggle(toggle) {
        this.setState({keyboardToggle: toggle})
    }

    //FORM VALIDATION
    validateForm() {
        let emailErrorMessage = null;
        let passwordErrorMessage = null;
        let isValid = true;
        let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regEmail.test(this.props.email)) {
            emailErrorMessage = "Veuillez entrer une adresse email valide";
            isValid = false;
        }
        if (!this.props.password || this.props.password.length < 1) {
            passwordErrorMessage = "Veuillez entrer un mot de passe";
            isValid = false;
        }
        this.setState({
            emailErrorMessage: emailErrorMessage,
            passwordErrorMessage: passwordErrorMessage
        });
        return isValid;
    }

    renderLogo() {
        if (this.state.keyboardToggle) {
            return <View style={[GlobalStyles.flexRow, {alignItems: 'center'}]}>
                <Image
                    style={{width: 80, height: 80, margin: 10}}
                    source={TOILET_LOGO}
                />
                <Text style={[GlobalStyles.logoText, {fontSize: 30, margin: 10}]}>
                    toilet advisor
                </Text>
            </View>
        }
        else {
            return <View style={[GlobalStyles.flexColumnCenter, {marginBottom: 20}]}>
                <Image
                    style={{marginLeft: 30}}
                    source={TOILET_LOGO}
                />
                <Text style={GlobalStyles.logoText}>
                    toilet advisor
                </Text>
            </View>
        }
    }

    renderRegisterSection() {
        if (!this.state.keyboardToggle) {
            return <View style={{marginTop: 50}}>
                <Text style={[GlobalStyles.secondaryText, {alignSelf: 'center', marginBottom: 5}]}>Pas de compte ?</Text>
                <Button title="S'INSCRIRE"
                        onPress={() => this.handlePressRegisterButton()}
                        buttonStyle={GlobalStyles.secondaryButton}
                        titleStyle={GlobalStyles.secondaryButtonTitle}
                ></Button>
            </View>
        }
    }

    render() {
        return <View style={[GlobalStyles.withMarginContainer, {marginBottom: 20}]}>
            {this.renderLogo()}
            <FormInput value={this.props.email}
                       onChangeText={(text) => this.handleChangeEmail(text)}
                       placeholder="toilette@alaturc.com"
                       errorMessage={this.state.emailErrorMessage}
                       keyboardType="email-address"
                       autoCapitalize="none"></FormInput>
            <FormInput value={this.props.password}
                       onChangeText={(text) => this.handleChangePassword(text)}
                       placeholder="**********"
                       errorMessage={this.state.passwordErrorMessage}
                       secureTextEntry={true}></FormInput>
            <Button title="SE CONNECTER"
                    onPress={() => this.handlePressLoginButton()}
                    buttonStyle={GlobalStyles.primaryButton}
            ></Button>
            {this.renderRegisterSection()}

            <KeyboardSpacer onToggle={(toggle) => this.handleKeyboardSpacerToggle(toggle)}/>
        </View>
    }


}

function mapStateToProps(state) {
    return {
        password: state.authReducer.password,
        email: state.authReducer.email
    };
}


export default connect(mapStateToProps)(LoginView);