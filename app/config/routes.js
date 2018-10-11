import Map from "../views/map/Map";
import Toilet from "../views/toilet/Toilet"

const Routes = {
    Map: { screen: Map },
    Toilet: { screen: Toilet }
};

const ROUTE_NAMES = {
    MAP: 'Map',
    TOILET: 'Toilet'
};

export {Routes, ROUTE_NAMES};