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

        this.handlePressSubmitButton = this.handlePressSubmitButton.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleKeyboardSpacerToggle = this.handleKeyboardSpacerToggle.bind(this);

        this.state = {
            emailErrorMessage: null,
            passwordErrorMessage: null,
            registerScreen: false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.hasSubmitted && (prevProps.email !== this.props.email || prevProps.password !== this.props.password || prevProps.username !== this.props.username)) {
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

    handleChangeUsername(text) {
        this.props.dispatch({type: ACTIONS_AUTH.USERNAME_FIELD_CHANGE, value: text});
    }

    handlePressSubmitButton() {
        let _this = this;
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            if (this.state.registerScreen) {
                register();
            }
            else {
                login()
            }
        }

        function login() {
            AuthEndpoints.login(_this.props.email, _this.props.password).then((data) => {
                if (data.errorType === ERROR_TYPES.WRONG_CRED) {
                    _this.setState({passwordErrorMessage: "Votre e-mail/mot de passe est incorrect"});
                    return false;
                }
                else if (!data.token) {
                    console.log(data);
                    Alert.alert("Une erreur est survenue.");
                    return;
                }
                DeviceStorage.saveJWT(data.token).then(() => {
                    _this.setState({hasSubmitted: false});
                    _this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: data.token});
                });
            }).catch((error) => {
                console.log(error);
                Alert.alert("Une erreur est survenue.")
            })
        }

        function register() {
            AuthEndpoints.register(_this.props.email, _this.props.username, _this.props.password).then((data) => {
                if (!data.token) {
                    console.log(data);
                    Alert.alert("Une erreur est survenue.");
                    return;
                }
                DeviceStorage.saveJWT(data.token).then(() => {
                    _this.setState({hasSubmitted: false});
                    _this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: data.token});
                });
            }).catch((error) => {
                console.log(error);
                Alert.alert("Une erreur est survenue.")
            })
        }

    }

    handlePressSwitch() {
        this.setState({registerScreen: !this.state.registerScreen});
    }

    handleKeyboardSpacerToggle(toggle) {
        this.setState({keyboardToggle: toggle})
    }

    //FORM VALIDATION
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
        if (!this.props.password || this.props.password.length < 1) {
            passwordErrorMessage = "Veuillez entrer un mot de passe";
            isValid = false;
        }
        if (this.state.registerScreen && (!this.props.username || this.props.username.length < 1)) {
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
            let size = 120;
            if (this.state.registerScreen) {
                size = 100;
            }
            return <View style={[GlobalStyles.flexColumnCenter, {marginBottom: 20}]}>
                <Image
                    style={{marginLeft: 30, width: size, height: size}}
                    source={TOILET_LOGO}
                />
                <Text style={GlobalStyles.logoText}>
                    toilet advisor
                </Text>
            </View>
        }
    }

    renderSwitchButton() {
        if (!this.state.keyboardToggle) {
            let questionLabel = 'Pas de compte ?';
            let buttonTitle = "S'INSCRIRE";
            if (this.state.registerScreen) {
                questionLabel = "Vous possédez déja un compte ?";
                buttonTitle = "SE CONNECTER";
            }
            return <View style={{marginTop: 50}}>
                <Text style={[GlobalStyles.secondaryText, {alignSelf: 'center', marginBottom: 5}]}>{questionLabel}</Text>
                <Button title={buttonTitle}
                        onPress={() => this.handlePressSwitch()}
                        buttonStyle={GlobalStyles.secondaryButton}
                        titleStyle={GlobalStyles.secondaryButtonTitle}
                ></Button>
            </View>
        }
    }

    renderRegisterSection() {
        return <View style={[GlobalStyles.withMarginContainer, {marginBottom: 20}]}>
            {this.renderLogo()}
            <FormInput label="E-mail"
                value={this.props.email}
                       onChangeText={(text) => this.handleChangeEmail(text)}
                       placeholder="toilette@alaturc.com"
                       errorMessage={this.state.emailErrorMessage}
                       keyboardType="email-address"
                       autoCapitalize="none"></FormInput>
            <FormInput label="Nom d'utilisateur"
                value={this.props.username}
                       onChangeText={(text) => this.handleChangeUsername(text)}
                       placeholder="Mr. Hankey"
                       errorMessage={this.state.usernameErrorMessage}
            ></FormInput>
            <FormInput label="Mot de passe"
                       value={this.props.password}
                       onChangeText={(text) => this.handleChangePassword(text)}
                       placeholder="**********"
                       errorMessage={this.state.passwordErrorMessage}
                       secureTextEntry={true}></FormInput>
            <Button title="S'INSCRIRE"
                    onPress={() => this.handlePressSubmitButton()}
                    buttonStyle={GlobalStyles.primaryButton}
            ></Button>
            {this.renderSwitchButton()}

            <KeyboardSpacer onToggle={(toggle) => this.handleKeyboardSpacerToggle(toggle)}/>
        </View>
    }

    renderLoginSection() {
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
                    onPress={() => this.handlePressSubmitButton()}
                    buttonStyle={GlobalStyles.primaryButton}
            ></Button>
            {this.renderSwitchButton()}

            <KeyboardSpacer onToggle={(toggle) => this.handleKeyboardSpacerToggle(toggle)}/>
        </View>
    }

    render() {
        if (this.state.registerScreen) {
            return this.renderRegisterSection()
        }
        else {
            return this.renderLoginSection()
        }

    }


}

function mapStateToProps(state) {
    return {
        password: state.authReducer.password,
        email: state.authReducer.email,
        username: state.authReducer.username
    };
}


export default connect(mapStateToProps)(LoginView);