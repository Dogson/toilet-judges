//LIBRAIRIES
import React from 'react';
import {StyleSheet, View, ActivityIndicator, TouchableNativeFeedback, Text, Alert} from 'react-native';
import {connect} from "react-redux";
import {createDrawerNavigator, createStackNavigator, DrawerItems, SafeAreaView} from "react-navigation";
import {Icon} from "react-native-elements";

//CONST
import {
    LoginRoutes,
    DrawerRoutes,
    transitionConfig
} from "../../../config/navigationConfig";
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";

//API ENDPOINTS
import {AuthEndpoints} from "../../../endpoints/authEndpoints";

//COMPONENTS


class AppRedux extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            loading: true
        };

        const Logout = {
            contentComponent: (props) => {
                return (
                    <View style={{flex: 1}}>
                        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                            <DrawerItems {...props} />
                            <TouchableNativeFeedback onPress={this._handleLogoutPress}>
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
                activeTintColor: 'white',
                activeBackgroundColor: STYLE_VAR.backgroundDefault,
                inactiveTintColor: STYLE_VAR.text.color.primary,
                inactiveBackgroundColor: 'transparent',
            }
        };

        this.LoginNavigator = createStackNavigator(LoginRoutes, {transitionConfig: transitionConfig});
        this.DrawerNavigator = createDrawerNavigator(DrawerRoutes, Logout);
    }

    _handleLogoutPress() {
        Alert.alert(
            "",
            'Voulez-vous vraiment vous déconnecter ?',
            [
                {text: 'Non', style: 'cancel'},
                {text: 'Oui', onPress: () => {AuthEndpoints.logout()}},
            ]
        )
    }

    componentDidMount() {
        let _this = this;
        AuthEndpoints.checkLoginStatus((exist, isLoggedIn) => {
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

const
    styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center'
        }
    });

function

mapStateToProps(state) {
    return {
        user: state.rootReducer.user
    };
}

export default connect(mapStateToProps)

(
    AppRedux
)
;