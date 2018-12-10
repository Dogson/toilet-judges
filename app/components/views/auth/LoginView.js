// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {ScrollView, View, Image, Text, Alert} from "react-native";
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
import {FormInput} from "../../widgets/form/FormInput";
import {ERROR_TYPES} from "../../../config/errorTypes";
import {ROUTE_NAMES} from "../../../config/navigationConfig";

class LoginView extends React.Component {
    constructor(props) {
        super(props);

        this._handlePressSubmitButton = this._handlePressSubmitButton.bind(this);
        this._handleChangeEmail = this._handleChangeEmail.bind(this);
        this._handleChangePassword = this._handleChangePassword.bind(this);
        this._handleChangeUsername = this._handleChangeUsername.bind(this);

        this.state = {
            emailErrorMessage: null,
            passwordErrorMessage: null,
            isReady: true
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.hasSubmitted && (prevProps.email !== this.props.email || prevProps.password !== this.props.password || prevProps.username !== this.props.username)) {
            this.validateForm();
        }
    }

    componentWillUnmount() {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: null});
        this.props.dispatch({type: ACTIONS_AUTH.PASSWORD_FIELD_CHANGE, value: null});
        this.props.dispatch({type: ACTIONS_AUTH.USERNAME_FIELD_CHANGE, value: null});
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
            AuthEndpoints.login(_this.props.email, _this.props.password).then((data) => {
                if (data.errorType === ERROR_TYPES.WRONG_CRED) {
                    _this.setState({passwordErrorMessage: "Votre e-mail/mot de passe est incorrect"});
                    this.setState({isReady: true});
                    return;
                }
                else if (!data.token) {
                    Alert.alert("Une erreur est survenue.");
                    this.setState({isReady: true});
                    return;
                }
                DeviceStorage.saveJWT(data.token).then(() => {
                    _this.setState({hasSubmitted: false, isReady: true});
                    _this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: data.token});
                });
            }).catch((error) => {
                this.setState({isReady: true});
                console.log(error);
                Alert.alert("Une erreur est survenue.")
            })
        }
    }

    _handlePressSwitch() {
        this.props.navigation.navigate(ROUTE_NAMES.REGISTER);
    }

    //FORM VALIDATION
    validateForm() {
        let emailErrorMessage = null;
        let passwordErrorMessage = null;
        let isValid = true;
        let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regEmail.test(this.props.email)) {
            emailErrorMessage = "Veuillez entrer une adresse e-mail valide";
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

    renderRegisterSwitchButton() {
        return <View style={{marginTop: 50}}>
            <Text
                style={[GlobalStyles.secondaryText, {alignSelf: 'center', marginBottom: 5}]}>Pas de compte ?</Text>
            <Button title="S'INSCRIRE"
                    onPress={() => this._handlePressSwitch()}
                    buttonStyle={GlobalStyles.secondaryButton}
                    titleStyle={GlobalStyles.secondaryButtonTitle}
            ></Button>
        </View>
    }

    render() {
        return <ScrollView style={[GlobalStyles.withMarginContainer, {marginVertical: 50}]}
                           keyboardShouldPersistTaps="handled">
            {this.renderLogo()}
            <FormInput value={this.props.email}
                       onChangeText={(text) => this._handleChangeEmail(text)}
                       placeholder="toilette@alaturc.com"
                       errorMessage={this.state.emailErrorMessage}
                       keyboardType="email-address"
                       autoCapitalize="none"></FormInput>
            <FormInput value={this.props.password}
                       onChangeText={(text) => this._handleChangePassword(text)}
                       placeholder="**********"
                       errorMessage={this.state.passwordErrorMessage}
                       secureTextEntry={true}></FormInput>
            <Button title="SE CONNECTER"
                    onPress={() => this._handlePressSubmitButton()}
                    buttonStyle={GlobalStyles.primaryButton}
                    titleStyle={GlobalStyles.defaultFont}
                    loading={!this.state.isReady}
            ></Button>
            {this.renderRegisterSwitchButton()}

            <KeyboardSpacer/>
        </ScrollView>
    }
}

function mapStateToProps(state) {
    return {
        password: state.authReducer.password,
        email: state.authReducer.email
    };
}


export default connect(mapStateToProps)(LoginView);