import React from 'react';
import {MapView} from 'expo';
import {connect} from "react-redux";
import {View, Text} from "react-native";

class Map extends React.Component {
    componentDidMount() {
        this.setState({marginBottom: 1});
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setMapPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            }, (error) => {
                console.log(error);
            });
    }

    // DISPATCH ACTIONS
    setMapPosition = (position) => {
        this.props.dispatch({type: "SET_POSITION", value: position});
    };

    // Workaround for MyLocationButton not showing
    _onMapReady = () => this.setState({marginBottom: 0});


    render() {
        let result;
        if (this.props.position) {
            result = <MapView
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
        }
        else {
            result = <View><Text>Loading...</Text></View>
        }
        return result;
    }
}

function mapStateToProps(state) {

    return {
        position: state.mapReducer.position
    };
}

export default connect(mapStateToProps)(Map);