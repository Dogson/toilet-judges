import HomeView from "../components/views/home/HomeView"
import ToiletView from "../components/views/toilet/ToiletView"

const Routes = {
    Map: {
        screen: HomeView,
        navigationOptions: {
            header: null,
        }
    },
    Toilet: {
        screen: ToiletView,
        navigationOptions: ({navigation}) => {
            return {
                title: navigation.getParam('toilet').placeName,
            };
        }
    }
};

const ROUTE_NAMES = {
    MAP: 'Map',
    TOILET: 'Toilet'
};

export {Routes, ROUTE_NAMES};