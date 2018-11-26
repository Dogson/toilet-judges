import {Easing, Animated} from 'react-native';
import HomeView from "../components/views/home/HomeView"
import ToiletView from "../components/views/toilet/ToiletView"
import ReviewStepOne from "../components/views/review/reviewForm/ReviewStepOne"
import ReviewStepTwo from "../components/views/review/reviewForm/ReviewStepTwo"
import ReviewStepThree from "../components/views/review/reviewForm/ReviewStepThree"
import ReviewDetails from "../components/views/review/reviewDetails/ReviewDetails"

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
            };
        }
    },
    ReviewStepOne: {
        screen: ReviewStepOne,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title')
            };
        }
    },
    ReviewStepTwo: {
        screen: ReviewStepTwo,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title')
            };
        }
    },
    ReviewStepThree: {
        screen: ReviewStepThree,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title')
            };
        }
    },
    ReviewDetails: {
        screen: ReviewDetails,
        navigationOptions: {
            header: null
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
    FROM_RIGHT: 'slideFromRight',
    FROM_BOTTOM: 'slideFromBottom'
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
                slideFromBottom: SlideFromBottom(index, position, height),
                default: SlideFromRight(index, position, width),
            }[transition];
        },
    }
};

let SlideFromRight = (index, position, width) => {
    const inputRange = [index - 1, index, index + 1];
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0]
    });
    const slideFromRight = {transform: [{translateX}]}
    return slideFromRight
};


let SlideFromBottom = (index, position, height) => {
    const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0]
    });

    const slideFromBottom = {transform: [{translateY}]}

    return slideFromBottom;
};

const StackConfig = {
    transitionConfig: transitionConfig
};

export {MainRoutes, ROUTE_NAMES, TRANSITIONS, StackConfig};