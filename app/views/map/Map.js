// LIBRAIRIES
import React from 'react';
import {MapView} from 'expo';
import {connect} from "react-redux";
import {View, Text, StyleSheet} from "react-native";
import {SearchBar} from 'react-native-elements';

// INTERNAL
import {APP_CONFIG} from "../../appConfig";

class Map extends React.Component {
    // DISPATCH ACTIONS
    setMapPosition = (position) => {
        this.props.dispatch({type: "SET_POSITION", value: position});
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
        this.setState({marginBottom: 1});

    }

    // Workaround for MyLocationButton not showing
    _onMapReady = () => this.setState({marginBottom: 0});


    render() {
        let result;
        if (this.props.position) {
            result =
                <View style={{flex: 1}}>
                    <MapView
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
                    />
                    <View style={styles.searchBar}>
                        <SearchBar
                            showLoading
                            platform={APP_CONFIG.platform}
                            placeholder='Rechercher un restaurant, bar...'/>
                    </View>
                </View>
        }
        else {
            result =
                <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                    <Text>Chargement de la Carte des Toilettes</Text>
                    <Text style={{ fontSize: 6 }}>TM</Text>
                    <Text>...</Text>
            </View>
        }
        return result;
    }
}


function mapStateToProps(state) {
    return {
        position: state.mapReducer.position
    };
}

const styles = StyleSheet.create({
    searchBar: {
        position: "absolute",
        top: 10,
        left: 10,
        right: 10
    }
});

export default connect(mapStateToProps)(Map);