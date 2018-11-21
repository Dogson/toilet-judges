import HomeView from "../components/views/home/HomeView"
import ToiletView from "../components/views/toilet/ToiletView"
import ReviewFormView from "../components/views/review/reviewForm/ReviewFormView"

const Routes = {
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
    ReviewForm: {
        screen: ReviewFormView,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('title')
            };
        }
    }
};

const ROUTE_NAMES = {
    HOME: 'Home',
    TOILET: 'Toilet',
    REVIEW_FORM: 'ReviewForm'
};

export {Routes, ROUTE_NAMES};