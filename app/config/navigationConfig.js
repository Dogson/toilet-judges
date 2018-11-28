import * as React from "react";
import {Easing, Animated, TouchableNativeFeedback, View} from 'react-native';
import {Icon} from "react-native-elements";
import HomeView from "../components/views/home/HomeView"
import ToiletView from "../components/views/toilet/ToiletView"
import ReviewStepOne from "../components/views/review/reviewForm/ReviewStepOne"
import ReviewStepTwo from "../components/views/review/reviewForm/ReviewStepTwo"
import ReviewStepThree from "../components/views/review/reviewForm/ReviewStepThree"
import ReviewDetails from "../components/views/review/reviewDetails/ReviewDetails"
import {STYLE_VAR} from "../styles/stylingVar";
import {GlobalStyles} from "../styles/styles";
import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';

const MainRoutes = {
    HomeView: {
        screen: HomeView,
        navigationOptions: {
            header: null,
        }
    },
    Toilet: {
        screen: ToiletView,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('toiletPlace').placeName,
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
                headerTintColor: STYLE_VAR.text.color.primary
            };
        }
    }
};

const ROUTE_NAMES = {
    HOME: 'Home',
    TOILET: 'Toilet',
    REVIEW_STEP_ONE: 'ReviewStepOne',
    REVIEW_STEP_TWO: 'ReviewStepTwo',
    REVIEW_STEP_THREE: 'ReviewStepThree',
    REVIEW_DETAILS: 'ReviewDetails'
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
                default: StackViewStyleInterpolator.forHorizontal(sceneProps)
            }[transition];
        },
    }
};

const StackConfig = {
    transitionConfig: transitionConfig
};

export {MainRoutes, ROUTE_NAMES, TRANSITIONS, StackConfig};