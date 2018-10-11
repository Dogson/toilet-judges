import Map from "../views/map/Map";
import Toilet from "../views/toilet/Toilet"

const Routes = {
    Map: {
        screen: Map,
        navigationOptions: {
            header: null,
        }
    },
    Toilet: {
        screen: Toilet,
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