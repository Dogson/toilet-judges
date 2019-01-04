// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {ScrollView, View, Image, Text, Alert} from "react-native";
import {Button} from 'react-native-elements';
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

        this.state = {
            emailErrorMessage: null,
            isReady: true,
            emailSent: false
        }
    }

    componentDidUpdate(prevProps) {
        this.setState({emailSent: false});
        if (this.state.hasSubmitted && prevProps.email !== this.props.email) {
            this.validateForm();
        }
    }

    componentWillUnmount() {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: null});
    }


    //EVENTS
    _handleChangeEmail(text) {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: text});
    }

    _handlePressSubmitButton() {
        let _this = this;
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            this.setState({isReady: false});
            AuthEndpoints.resetPassword(this.props.email).then(() => {
                this.setState({emailSent: true})
            }).catch((error) => {
            else {
                    Alert.alert("Une erreur est survenue.")
                }
                this.setState({isReady: true});
            })
        }
    }

    //FORM VALIDATION
    validateForm() {
        let emailErrorMessage = null;
        let isValid = true;
        let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regEmail.test(this.props.email)) {
            emailErrorMessage = "Veuillez entrer une adresse e-mail valide";
            isValid = false;
        }
        this.setState({
            emailErrorMessage: emailErrorMessage,
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

    renderLoginButton() {
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