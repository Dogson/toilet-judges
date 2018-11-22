import {Easing, Animated} from 'react-native';
import HomeView from "../components/views/home/HomeView"
import ToiletView from "../components/views/toilet/ToiletView"
import ReviewStepOne from "../components/views/review/reviewForm/ReviewStepOne"

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
    }
};

// const ReviewFormRoutes: {
//     Step1: {
//         screen: StepOneView
//     }
// }

const ROUTE_NAMES = {
    HOME: 'Home',
    TOILET: 'Toilet',
    REVIEW_STEP_ONE: 'ReviewStepOne'
};


const transitionConfig = () => {
    return {
        transitionSpec: {
            duration: 400,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps

            const thisSceneIndex = scene.index
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex],
                outputRange: [width, 0],
            })

            return { transform: [ { translateX } ] }
        },
    }
};

const StackConfig = {
    transitionConfig: transitionConfig
};

export {MainRoutes, ROUTE_NAMES, StackConfig};