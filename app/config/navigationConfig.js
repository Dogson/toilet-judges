import * as React from "react";
import {Easing, Animated, TouchableNativeFeedback, View} from 'react-native';
import {Icon} from "react-native-elements";
import Menu, {
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import getSceneIndicesForInterpolationInputRange
    from "react-navigation/src/utils/getSceneIndicesForInterpolationInputRange";

import HomeView from "../components/views/home/HomeView"
import SearchView from "../components/views/home/SearchView"
import MapFullView from "../components/views/home/MapFullView"
import ToiletView from "../components/views/toilet/ToiletView"
import ReviewStepOne from "../components/views/review/reviewForm/ReviewStepOne"
import ReviewStepTwo from "../components/views/review/reviewForm/ReviewStepTwo"
import ReviewStepThree from "../components/views/review/reviewForm/ReviewStepThree"
import ReviewDetails from "../components/views/review/reviewDetails/ReviewDetails"
import LoginView from "../components/views/auth/LoginView"
import RegisterView from "../components/views/auth/RegisterView"

import {STYLE_VAR} from "../styles/stylingVar";
import {GlobalStyles} from "../styles/styles";


/**
 *
 *  DEFINITION OF NAVIGATION ROUTES AND TRANSITIONS
 *
 * */

const MainRoutes = {
    Home: {
        screen: HomeView,
        navigationOptions: {
            header: null,
        }
    },
    Search: {
        screen: SearchView,
        navigationOptions: {
            header: null
        }
    },
    Map: {
        screen: MapFullView,
        navigationOptions: {
            header: null
        }
    },
    Toilet: {
        screen: ToiletView,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('placeName'),
                headerTintColor: STYLE_VAR.text.color.primary,
                headerTitleStyle: GlobalStyles.primaryText
            };
        }
    },
    ReviewStepOne: {
        screen: ReviewStepOne,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title'),
                headerTintColor: STYLE_VAR.text.color.primary,
                headerTitleStyle: GlobalStyles.primaryText
            };
        }
    },
    ReviewStepTwo: {
        screen: ReviewStepTwo,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title'),
                headerTintColor: STYLE_VAR.text.color.primary,
                headerTitleStyle: GlobalStyles.primaryText
            };
        }
    },
    ReviewStepThree: {
        screen: ReviewStepThree,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title'),
                headerTintColor: STYLE_VAR.text.color.primary,
                headerTitleStyle: GlobalStyles.primaryText
            };
        }
    },
    ReviewDetails: {
        screen: ReviewDetails,
        navigationOptions: ({navigation}) => {
            return {
                headerStyle: {
                    borderWidth: 0,
                    backgroundColor: 'white',
                    elevation: 0
                },
                headerLeft: <TouchableNativeFeedback onPress={() => navigation.goBack(null)}>
                    <View style={{padding: 15}}><Icon name="close"></Icon></View>
                </TouchableNativeFeedback>,
                headerRight: <View>
                    <Menu>
                        <MenuTrigger><Icon name="more-vert" containerStyle={{padding: 15}}/></MenuTrigger>
                        <MenuOptions customStyles={{
                            optionsWrapper: {width: 'auto', right: 0},
                            optionWrapper: {paddingVertical: 15, paddingHorizontal: 10},
                            optionText: GlobalStyles.primaryText,
                        }}>
                            <MenuOption onSelect={navigation.state.params.handleEdit} text="Modifier l'avis"/>
                            <MenuOption onSelect={navigation.state.params.handleDelete} text="Supprimer l'avis"/>
                        </MenuOptions>
                    </Menu>
                </View>,
                headerTintColor: STYLE_VAR.text.color.primary
            };
        }
    }
};

const LoginRoutes = {
    Login: {
        screen: LoginView,
        navigationOptions: {
            header: null,
        }
    },
    Register: {
        screen: RegisterView,
        navigationOptions: {
            header: null
        }
    },
};

const ROUTE_NAMES = {
    HOME: 'Home',
    SEARCH: 'Search',
    MAP: 'Map',
    TOILET: 'Toilet',
    REVIEW_STEP_ONE: 'ReviewStepOne',
    REVIEW_STEP_TWO: 'ReviewStepTwo',
    REVIEW_STEP_THREE: 'ReviewStepThree',
    REVIEW_DETAILS: 'ReviewDetails',
    LOGIN: 'Login',
    REGISTER: 'Register'
};

const TRANSITIONS = {
    FROM_BOTTOM: 'slideFromBottom',
};

const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 400,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: (sceneProps) => {
            const {layout, position, scene} = sceneProps;
            const width = layout.initWidth;
            const height = layout.initHeight;
            const {index, route} = scene
            const params = route.params || {}; // <- That's new
            const transition = params.transition || 'default'; // <- That's new
            return {
                slideFromBottom: StackViewStyleInterpolator.forVertical(sceneProps),
                default: forHorizontal(sceneProps)
            }[transition];
        },
    }
};

function forInitial(props) {
    const {navigation, scene} = props;

    const focused = navigation.state.index === scene.index;
    const opacity = focused ? 1 : 0;
    // If not focused, move the scene far away.
    const translate = focused ? 0 : 1000000;
    return {
        opacity,
        transform: [{translateX: translate}, {translateY: translate}]
    };
}

function forHorizontal(props) {
    const {layout, position, scene} = props;

    if (!layout.isMeasured) {
        return forInitial(props);
    }
    const interpolate = getSceneIndicesForInterpolationInputRange(props);

    if (!interpolate) return {opacity: 0};

    const {first, last} = interpolate;
    const index = scene.index;
    const opacity = position.interpolate({
        inputRange: [first, first + 0.01, index, last - 0.01, last],
        outputRange: [0, 1, 1, 0.85, 0],
        extrapolate: 'clamp'
    });

    const width = layout.initWidth;
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0],
        extrapolate: 'clamp'
    });
    const translateY = 0;

    return {
        opacity,
        transform: [{translateX}, {translateY}]
    };
}

const StackConfig = {
    transitionConfig: transitionConfig
};

export {MainRoutes, LoginRoutes, ROUTE_NAMES, TRANSITIONS, StackConfig};