// LIBRAIRIES
import React from 'react';
import {
    Text,
    View,
    Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import firebase from "@firebase/app";
import "firebase/auth";
import "firebase/database";
import {FormInput} from "../../widgets/form/FormInput";

// CONST
import {GlobalStyles} from "../../../styles/styles";

// API ENDPOINTS

//COMPONENTS

export default class EditUsernameView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            isReady: true,
            usernameErrorMessage: null,
            hasSubmitted: false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.hasSubmitted && (prevState.username !== this.state.username)) {
            this.validateForm();
        }
    }


    // HANDLING EVENTS
    _handleChangeUsername(text) {
        this.setState({username: text});
    }

    _handlePressSubmitButton() {
        let _this = this;
        this.setState({hasSubmitted: true});
        if (this.validateForm()) {
            this.setState({isReady: false});
            firebase.auth().currentUser.updateProfile({displayName: this.state.username})
                .then(() => {
                    _this.props.navigation.getParam('onFinishEditing')(this.state.username);
                    _this.setState({hasSubmitted: false});
                    _this.props.navigation.goBack(null);
                })
                .catch((error) => {
                    Alert.alert("Une erreur est survenue.");
                    console.log(error);
                    this.setState({isReady: true});
                })
        }
    }

    //FORM VALIDATION
    validateForm() {
        let usernameErrorMessage = null;
        let isValid = true;
        if (!this.state.username || this.state.username.length < 1) {
            usernameErrorMessage = "Veuillez entrer un nom d'utilisateur";
            isValid = false;
        }
        this.setState({
            usernameErrorMessage: usernameErrorMessage,
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
                    Modifier votre nom d'utilisateur
                </Text>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View>
                    <Text style={GlobalStyles.secondaryText}>Votre nouveau nom d'utilisateur</Text>
                    <FormInput label="Nom d'utilisateur"
                               value={this.state.username}
                               onChangeText={(text) => this._handleChangeUsername(text)}
                               placeholder="Mr. Hankey"
                               errorMessage={this.state.usernameErrorMessage}/>
                </View>
            </View>
            <Button title="MODIFIER LE NOM D'UTILISATEUR"
                    onPress={() => this._handlePressSubmitButton()}
                    buttonStyle={GlobalStyles.primaryButton}
                    titleStyle={GlobalStyles.defaultFont}
                    loading={!this.state.isReady}
            ></Button>
        </View>
    }

}

