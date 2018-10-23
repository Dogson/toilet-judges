// LIBRAIRIES
import React from 'react';
import {connect} from "react-redux";
import {View, TextInput} from "react-native";
import {Button} from 'react-native-elements';
import {DeviceStorage} from "../../../helpers/deviceStorage";


// CONST
import {ACTIONS_AUTH} from "./AuthActions";
import {ACTIONS_ROOT} from "../root/RootActions";

// API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";

//COMPONENTS

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
            DeviceStorage.saveJWT(data.token).then(() => {
                this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: data.token});
            });
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
        password: state.authReducer.password,
        email: state.authReducer.email
    };
}


export default connect(mapStateToProps)(LoginView);