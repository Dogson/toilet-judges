// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {View, Text, StyleSheet, ActivityIndicator, BackHandler, StatusBar, TextInput} from "react-native";
import {Button} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';


// CONST
import {ACTIONS_AUTH} from "./AuthActions";

// API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";

//COMPONENTS

//STYLE
import {GlobalStyles} from "../../../styles/styles";

class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.handlePressButton = this.handlePressButton.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    //EVENTS
    handlePressButton() {
        AuthEndpoints.login(this.props.email, this.props.password).then((data) => {
            this.props.dispatch({type: ACTIONS_AUTH.LOG_IN, value: data.token});
        })
    }

    handleChangeEmail(text) {
        this.props.dispatch({type: ACTIONS_AUTH.EMAIL_FIELD_CHANGE, value: text});
    }

    handleChangePassword(text) {
        this.props.dispatch({type: ACTIONS_AUTH.PASSWORD_FIELD_CHANGE, value: text});
    }

    render() {
        return <View style={{marginTop: 60}}>
            <TextInput value={this.props.email}
                       onChangeText={(text) => this.handleChangeEmail(text)}></TextInput>
            <TextInput value={this.props.password}
                       onChangeText={(text) => this.handleChangePassword(text)}></TextInput>
            <Button onPress={() => this.handlePressButton()}></Button>
        </View>
    }


}

function mapStateToProps(state) {
    return {
        newJWT: state.authReducer.newJWT,
        password: state.authReducer.password,
        email: state.authReducer.email
    };
}


export default connect(mapStateToProps)(LoginView);