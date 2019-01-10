// LIBRAIRIES
import React from 'react';
import {
    Text,
    View,
    Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import * as firebase from "firebase";
import {FormInput} from "../../widgets/form/FormInput";

// CONST
import {GlobalStyles} from "../../../styles/styles";
import {ERROR_TYPES} from "../../../config/errorTypes";

// API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";

//COMPONENTS

export default class EditEmailView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            isReady: true,
            emailErrorMessage: null,
            passwordErrorMessage: null,
            hasSubmitted: false
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.hasSubmitted && (prevState.email !== this.state.email || prevState.password !== this.state.password)) {
            this.validateForm();
        }
    }


    // HANDLING EVENTS
    _handleChangeEmail(text) {
        this.setState({email: text});
    }

    _handleChangePassword(text) {
        this.setState({password: text});
    }

    _handlePressSubmitButton() {
        let _this = this;
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            this.setState({isReady: false});
            AuthEndpoints.login(firebase.auth().currentUser.email, _this.state.password)
                .then(() => {
                    return firebase.auth().currentUser.updateEmail(this.state.email)
                })
                .then(() => {
                    _this.props.navigation.getParam('onFinishEditing')(this.state.email);
                    _this.setState({hasSubmitted: false});
                    _this.props.navigation.goBack(null);
                })
                .catch((error) => {
                    if (ERROR_TYPES.USER_NOT_FOUND.indexOf(error.code) > -1) {
                        this.setState({passwordErrorMessage: "Votre mot de passe est incorrect"});
                    }
                    else if (ERROR_TYPES.USER_EXISTS.indexOf(error.code) > -1) {
                        this.setState({emailErrorMessage: "Cette adresse e-mail est déja associée à un compte"});
                    }
                    else {
                        Alert.alert("Une erreur est survenue.");
                        console.log(error);
                    }
                    this.setState({isReady: true});
                })
        }
    }

    //FORM VALIDATION
    validateForm() {
        let emailErrorMessage = null;
        let passwordErrorMessage = null;
        let isValid = true;
        let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!regEmail.test(this.state.email)) {
            emailErrorMessage = "Veuillez entrer une adresse e-mail valide";
            isValid = false;
        }
        if (!this.state.password || this.state.password.length < 1) {
            passwordErrorMessage = "Veuillez entrer votre mot de passe";
            isValid = false;
        }
        this.setState({
            emailErrorMessage: emailErrorMessage,
            passwordErrorMessage: passwordErrorMessage
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
                   Modifier votre adresse e-mail
                </Text>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View>
                    <Text style={GlobalStyles.secondaryText}>Votre nouvelle adresse e-mail</Text>
                    <FormInput value={this.state.email}
                               onChangeText={(text) => this._handleChangeEmail(text)}
                               placeholder="toilette@alaturc.com"
                               errorMessage={this.state.emailErrorMessage}
                               keyboardType="email-address"
                               autoCapitalize="none"></FormInput>
                </View>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View>
                    <Text style={GlobalStyles.secondaryText}>Votre mot de passe</Text>
                    <FormInput value={this.state.password}
                               onChangeText={(text) => this._handleChangePassword(text)}
                               placeholder="**********"
                               errorMessage={this.state.passwordErrorMessage}
                               secureTextEntry={true}></FormInput>
                </View>
            </View>
            <Button title="MODIFIER L'ADRESSE E-MAIL"
                    onPress={() => this._handlePressSubmitButton()}
                    buttonStyle={GlobalStyles.primaryButton}
                    titleStyle={GlobalStyles.defaultFont}
                    loading={!this.state.isReady}
            ></Button>
        </View>
    }

}

