// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {ScrollView, View, Image, Text, Alert, TouchableNativeFeedback, StatusBar} from "react-native";
import {Button, Icon} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// CONST
import {ACTIONS_AUTH} from "./AuthActions";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {GlobalStyles} from "../../../styles/styles";
const TOILET_LOGO = require('../../../../assets/img/toiletLogo.png');
import {ERROR_TYPES} from "../../../config/errorTypes";
import {ROUTE_NAMES} from "../../../config/navigationConfig";

// API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";

//COMPONENTS
import {FormInput} from "../../widgets/form/FormInput";

class PasswordResetView extends React.Component {
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
        if (this.state.hasSubmitted && prevProps.email !== this.props.email) {
            this.validateForm();
        }
    }

    componentWillUnmount() {
        this.setState({emailSent: false});
    }


    //EVENTS
    _handleChangeEmail(text) {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: text});
    }

    _handlePressSubmitButton() {
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            this.setState({isReady: false});
            AuthEndpoints.resetPassword(this.props.email).then(() => {
                this.setState({emailSent: true, isReady: true})
            }).catch((error) => {
                if (ERROR_TYPES.USER_NOT_FOUND.indexOf(error.code) > -1) {
                    this.setState({emailErrorMessage: "L'utilisateur n'a pas été trouvé"})
                }
                else {
                    Alert.alert("Une erreur est survenue.");
                }
                this.setState({isReady: true});
            })
        }
    }

    _handlePressSwitch() {
        this.props.navigation.navigate(ROUTE_NAMES.LOGIN);
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
                toilet judges
            </Text>
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

    renderBody() {
        if (!this.state.emailSent) {
            return <View>
                <Text style={GlobalStyles.primaryText}>Réinitialisation du mot de passe</Text>
                <Text style={GlobalStyles.secondaryText}>Vous recevrez un lien vous permettant de réinitialiser votre
                    mot de passe.</Text>
                <FormInput value={this.props.email}
                           inputContainerStyle={{marginVertical: 20}}
                           onChangeText={(text) => this._handleChangeEmail(text)}
                           placeholder="toilette@alaturc.com"
                           errorMessage={this.state.emailErrorMessage}
                           keyboardType="email-address"
                           autoCapitalize="none"></FormInput>
                <View style={{marginTop: 10}}>
                    <Button title="REINITIALISER"
                            onPress={() => this._handlePressSubmitButton()}
                            buttonStyle={GlobalStyles.primaryButton}
                            loading={!this.state.isReady}
                    ></Button>
                </View>
            </View>
        }
        else {
            return <View>
                <Text style={GlobalStyles.primaryText}>E-mail envoyé</Text>
                <Text style={GlobalStyles.secondaryText}>L'e-mail de réinitialisation de mot de passe a été envoyé à
                    l'adresse suivante : </Text>
                <Text style={[GlobalStyles.secondaryText, GlobalStyles.boldText]}>{this.props.email}</Text>
                <View style={{marginTop: 30}}>
                    <Button title="SE CONNECTER"
                            onPress={() => this._handlePressSwitch()}
                            buttonStyle={GlobalStyles.primaryButton}
                            titleStyle={GlobalStyles.defaultFont}
                    ></Button>
                </View>
            </View>
        }
    }

    render() {
        return <View>
            {this.renderGoBackButton()}
            <ScrollView style={[GlobalStyles.withMarginContainer, {marginVertical: 50}]}
                        keyboardShouldPersistTaps="handled">
                {this.renderLogo()}
                {this.renderBody()}

                <KeyboardSpacer/>
            </ScrollView>
        </View>
    }
}

function mapStateToProps(state) {
    return {
        email: state.authReducer.email
    };
}


export default connect(mapStateToProps)(PasswordResetView);