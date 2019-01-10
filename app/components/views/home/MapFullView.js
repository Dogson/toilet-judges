// LIBRAIRIES
import React from 'react';
import {
    View,
    Text,
    TouchableNativeFeedback,
    StatusBar,
    ActivityIndicator
} from "react-native";
import {Icon} from "react-native-elements";
import {MapView} from "expo";

//CONST
import {GlobalStyles} from "../../../styles/styles";

//API ENDPOINTS

//COMPONENTS

export default class MapFullView extends React.Component {

    //COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            position: null
        }
    }

    componentDidMount() {
        this.mounted = true;
        if (!this.state.position)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (this.mounted)
                        this.setMapPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        });
                }, (error) => {
                    console.log(error);
                });

        this.setState({marginBottom: 1});
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    setMapPosition = (position) => {
        this.setState({position: position});
    };


    // Workaround for MyLocationButton not showing
    _onMapReady = () => this.setState({marginBottom: 0});

    // RENDERING COMPONENTS
    renderCloseButton() {
        return <TouchableNativeFeedback onPress={() => this.props.navigation.goBack(null)}>
            <View style={{padding: 15, position: 'absolute', left: 0, top: 0}}><Icon name="close"></Icon></View>
        </TouchableNativeFeedback>
    }

    renderLoading() {
        return (
            <View style={{alignSelf: 'center', flexDirection: 'column'}}>
                <View>
                    <ActivityIndicator size="large"/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={GlobalStyles.secondaryText}>Chargement de la Carte des Toilettes</Text>
                    <Text style={{fontSize: 6}}>TM</Text>
                    <Text>...</Text>
                </View>
            </View>)
    };


    renderMap() {
        return <MapView
            style={{flex: 1, marginBottom: this.state.marginBottom}}
            onMapReady={this._onMapReady}
            initialRegion={{
                latitude: this.state.position.latitude,
                longitude: this.state.position.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            mapPadding={{
                top: 55
            }}
        />
    }

    render() {
        let loading;
        let map;
        if (this.state.position) {
            map = this.renderMap();
        }
        else {
            loading = this.renderLoading();
        }

        return <View style={{
            flex: 1,
            justifyContent: 'center',
            marginTop: StatusBar.currentHeight
        }}>
            {map}
            {loading}
            {this.renderCloseButton()}
        </View>
    }
}