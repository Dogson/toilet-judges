import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {connect} from "react-redux";

//Const
import {MainRoutes, LoginRoutes, StackConfig} from "../../../config/navigationConfig";
import {ACTIONS_ROOT} from "./RootActions";

import LoginView from "../auth/LoginView";
import {DeviceStorage} from "../../../helpers/deviceStorage";
import {createStackNavigator} from "react-navigation";

const Navigator = createStackNavigator(MainRoutes, StackConfig);
const LoginNavigator = createStackNavigator(LoginRoutes, StackConfig);

class AppRedux extends React.Component {
    constructor() {
        super();
        this.state = {
            jwt: '',
            loading: true
        };



        DeviceStorage.deleteJWT().then(() => {
            this.newJWT = this.newJWT.bind(this);
            this.loadJWT();
        });


    }

    loadJWT() {
        DeviceStorage.loadJWT()
            .then((jwt) => {
                this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: jwt});
                this.setState({loading: false})
            })
            .catch((error) => {
                console.log(error)
            })
    }

    newJWT(jwt) {
        DeviceStorage.saveJWT(jwt).then(() => {
            this.props.dispatch({type: ACTIONS_ROOT.SET_JWT, value: jwt});
        });
    }

    render() {
        let body;
        if (this.state.loading) {
            body = <ActivityIndicator></ActivityIndicator>
        }
        else if (!this.props.jwt || this.props.jwt === '') {
            body = <LoginNavigator/>;
        }
        else body = <Navigator/>;
        return (
            <View style={styles.container}>
                {body}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});

function mapStateToProps(state) {
    return {
        jwt: state.rootReducer.jwt
    };
}

export default connect(mapStateToProps)(AppRedux);