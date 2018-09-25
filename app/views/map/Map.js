// LIBRAIRIES
import React from 'react';
import {MapView} from 'expo';
import {connect} from "react-redux";
import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
import {SearchBar} from 'react-native-elements';
import SearchResults from './SearchResults';
const fetch = require('node-fetch');

// INTERNAL
import {APP_CONFIG} from "../../config/appConfig";
import {ACTIONS_MAPS} from "./MapActions";

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showMap: true}
    }

    // DISPATCH ACTIONS
    setMapPosition = (position) => {
        this.props.dispatch({type: ACTIONS_MAPS.SET_POSITION, value: position});
    };

    getNearbyToilets = () => {
        // this.props.dispatch({type: ACTIONS_MAPS.GET_NEARBY_TOILETS, value: nearbyToilets})
        //TODO FETCH
    };

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setMapPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.log(error);
            });

        this.setState({marginBottom: 1, showMap: true});

        this.getNearbyToilets();
    }

    // Workaround for MyLocationButton not showing
    _onMapReady = () => this.setState({marginBottom: 0});

    //Rendering components
    renderLoading() {
        return (
            <View style={{alignSelf: 'center', flexDirection: 'column'}}>
                <View>
                    <ActivityIndicator size="large"/>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text>Chargement de la Carte des Toilettes</Text>
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
                latitude: this.props.position.latitude,
                longitude: this.props.position.longitude,
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

    renderSearchResults() {
        return <SearchResults searchQuery={this.state.searchQuery}/>
    };

    render() {
        let result;
        let map;
        let searchResults;
        let loading;
        if (this.state.showMap) {
            if (this.props.position) {
                map = this.renderMap();
            }
            else {
                loading = this.renderLoading();
            }
        }
        else {
            searchResults = this.renderSearchResults()
        }

        result =
            <View style={{flex: 1, justifyContent: 'center'}}>
                {map}
                <View style={this.state.showMap && styles.searchBarMap}>
                    <SearchBar
                        platform={APP_CONFIG.platform}
                        onTouchStart={() => this.setState({showMap: false})}
                        onCancel={() => this.setState({showMap: true})}
                        placeholder='Rechercher un restaurant, bar...'
                        onChangeText={(searchQuery) => this.setState({searchQuery})}/>
                </View>
                {loading}
                {searchResults}
            </View>;
        return result;
    }
}


function mapStateToProps(state) {
    return {
        position: state.mapReducer.position,
        nearbyToilets: state.mapReducer.nearbyToilets
    };
}

const styles = StyleSheet.create({
    searchBarMap: {
        top: 0,
        position: "absolute"
    }
});

export default connect(mapStateToProps)(Map);