import React from 'react';
import {StyleSheet, View, ActivityIndicator, Button, TouchableNativeFeedback, Text} from 'react-native';
import {connect} from "react-redux";

//Const
import {
    MainRoutes,
    LoginRoutes,
    DrawerRoutes,
    transitionConfig
} from "../../../config/navigationConfig";
import {ACTIONS_ROOT} from "./RootActions";

import {DeviceStorage} from "../../../helpers/deviceStorage";
import {createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView} from "react-navigation";
import {Icon} from "react-native-elements";
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";

class AppRedux extends React.Component {
    constructor() {
        super();
        this.state = {
            jwt: '',
            loading: true
        };

        this.newJWT = this.newJWT.bind(this);
        this.deleteJWT = this.deleteJWT.bind(this);
        this.loadJWT();

        let _this = this;

        const Logout = {
            contentComponent: (props) => {
                return (
                    <View style={{flex: 1}}>
                        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                            <DrawerItems {...props} />
                            <TouchableNativeFeedback onPress={_this.deleteJWT}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    paddingVertical: 20
                                }}>
                                    <Icon name="logout" type="material-community" size={20}
                                          containerStyle={{paddingLeft: 20, paddingRight: 30}}
                                          color={STYLE_VAR.text.color.primary}/>
                                    <Text style={[GlobalStyles.drawerText, {color: STYLE_VAR.text.color.primary}]}>Se
                                        déconnecter</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </SafeAreaView>
                    </View>
                )
            },
            contentOptions: {
                itemsContainerStyle: {
                    marginTop: 10,
                    marginBottom: 30
                },
                labelStyle: GlobalStyles.drawerText,
                inactiveLabelStyle: {
                    color: STYLE_VAR.text.color.primary
                }

            }
        };

        this.LoginNavigator = createStackNavigator(LoginRoutes, {transitionConfig: transitionConfig});
        this.DrawerNavigator = createDrawerNavigator(DrawerRoutes, Logout);
    }

    deleteJWT() {
        DeviceStorage.deleteJWT()
            .then(() => {
                this.props.dispatch({type: ACTIONS_ROOT.DELETE_JWT});
                this.setState({loading: false})
            })
            .catch((error) => {
                console.log(error)
            })
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
        const LoginNavigator = this.LoginNavigator;
        const DrawerNavigator = this.DrawerNavigator;
        let body;
        if (this.state.loading) {
            body = <ActivityIndicator></ActivityIndicator>
        }
        else if (!this.props.jwt || this.props.jwt === '') {
            body = <LoginNavigator/>;
        }
        else body = <DrawerNavigator></DrawerNavigator>;
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