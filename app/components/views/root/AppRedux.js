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

import {createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView} from "react-navigation";
import {Icon} from "react-native-elements";
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {AuthEndpoints} from "../../../endpoints/authEndpoints";

class AppRedux extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            loading: true
        };

        let _this = this;

        const Logout = {
            contentComponent: (props) => {
                return (
                    <View style={{flex: 1}}>
                        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                            <DrawerItems {...props} />
                            <TouchableNativeFeedback onPress={() => AuthEndpoints.logout()}>
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

    componentDidMount() {
        let _this = this;AuthEndpoints.checkLoginStatus((exist, isLoggedIn) => {
            _this.setState({loading: false, exist, isLoggedIn});
        });
    }

    render() {
        const LoginNavigator = this.LoginNavigator;
        const DrawerNavigator = this.DrawerNavigator;
        let body;
        if (this.state.loading) {
            body = <ActivityIndicator></ActivityIndicator>
        }
        else if (!this.props.user) {
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
        user: state.rootReducer.user
    };
}

export default connect(mapStateToProps)(AppRedux);