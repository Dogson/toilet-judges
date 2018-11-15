// LIBRAIRIES
import React from 'react';
import {MapView} from 'expo';
import {connect} from "react-redux";
import {View, Text, StyleSheet, ActivityIndicator, BackHandler, StatusBar} from "react-native";
import {SearchBar} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let _ = require('lodash');
// CONST
import {APP_CONFIG} from "../../../config/appConfig";
import {ACTIONS_HOME} from "./HomeActions";
import {ACTIONS_ROOT} from "../root/RootActions";
import {ROUTE_NAMES} from "../../../config/routes";
import {ERROR_TYPES} from "../../../config/errorTypes";

// API ENDPOINTS
import {ToiletPlacesListEndpoints} from '../../../endpoints/toiletPlacesListEndpoints'

//COMPONENTS
import {SearchResults} from '../../search/SearchResults';
import {YesNoDialog} from '../../dialogs/YesNoDialog'

//STYLE
import {GlobalStyles} from "../../../styles/styles";
import {DeviceStorage} from "../../../helpers/deviceStorage";

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showMap: true, showExitDialog: false};

        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleChangeText = _.debounce(this.handleChangeText, 500);

        this.handlePressToilet = this.handlePressToilet.bind(this);

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

        this.handleExitApp = this.handleExitApp.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

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

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    //HANDLING EVENTS
    backToLoginView() {
        DeviceStorage.deleteJWT().then(() => {
            this.props.dispatch({type: ACTIONS_ROOT.DELETE_JWT});
        });
    }

    handleBackButtonClick() {
        if (!this.state.showMap) {
            this.setState({showMap: true});
            this.searchBar.clear();
        }
        else {
            this.setState({showExitDialog: true});
        }
        return true;
    }

    handleChangeText(searchQuery) {
        this.setState({...this.state, searchQuery});
        this.getToiletsBySearch();
    }

    handlePressToilet(toiletPlace) {
        this.props.navigation.navigate(ROUTE_NAMES.TOILET, {
            toiletPlace: toiletPlace
        });
    }

    handleExitApp() {
        this.setState({showExitDialog: false});
        this.setState({searchQuery: ''});
        BackHandler.exitApp();
    }

    // DISPATCH ACTIONS
    setMapPosition = (position) => {
        this.props.dispatch({type: ACTIONS_HOME.SET_POSITION, value: position});
    };

    getNearbyToilets = () => {
        ToiletPlacesListEndpoints.getAllPlaces()
            .then((toilets) => {
                if (toilets) {
                    this.props.dispatch({type: ACTIONS_HOME.SET_TOILETS_LIST, value: toilets});
                }
            })
            .catch((err) => {
                if (err.errorType === ERROR_TYPES.NOT_LOGGED) {
                    this.backToLoginView();
                }
            });
    };

    getToiletsBySearch() {
        ToiletPlacesListEndpoints.getToiletsFromSearch(this.state.searchQuery)
            .then((toilets) => {
                if (toilets) {
                    this.props.dispatch({type: ACTIONS_HOME.SET_TOILETS_LIST, value: toilets});
                }
            })
            .catch((err) => {
                if (err.errorType === ERROR_TYPES.NOT_LOGGED) {
                    this.backToLoginView();
                }
            });
    }

    // Workaround for MyLocationButton not showing
    _onMapReady = () => this.setState({marginBottom: 0});

    // RENDERING COMPONENTS
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

    renderExitDialog() {
        return <YesNoDialog showAlert={this.state.showExitDialog}
                            title="Souhaitez-vous quitter l'application ?"
                            cancel={() => this.setState({showExitDialog: false})}
                            confirm={this.handleExitApp}
        />
    }

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
        return <SearchResults searchQuery={this.state.searchQuery} toiletsList={this.props.toiletsList || []}
                              handlePressToilet={this.handlePressToilet}/>
    };

    render() {
        let result;
        let map;
        let searchResults;
        let loading;
        let exitDialog = this.renderExitDialog();
        let searchBarStyle = [styles.searchBar];
        if (this.state.showMap) {
            if (this.props.position) {
                map = this.renderMap();
            }
            else {
                loading = this.renderLoading();
            }

            searchBarStyle.push(styles.searchBarMap);
        }
        else {
            searchResults = this.renderSearchResults()
        }

        result =
            <View style={{flex: 1, justifyContent: 'center', marginTop: StatusBar.currentHeight}}>
                {map}
                <View style={searchBarStyle}>
                    <SearchBar
                        ref={input => {
                            this.searchBar = input
                        }}
                        platform={APP_CONFIG.platform}
                        onTouchStart={() => this.setState({showMap: false})}
                        onCancel={() => this.setState({showMap: true})}
                        placeholder='Rechercher un restaurant, bar...'
                        onChangeText={(searchQuery) => this.handleChangeText(searchQuery)}
                        containerStyle={[styles.searchBar]}
                        rightIconContainerStyle={styles.clearButton}
                        inputStyle={GlobalStyles.primaryText}/>
                </View>
                {loading}
                {searchResults}
                {exitDialog}
                <KeyboardSpacer/>
            </View>;
        return result;
    }
}


function mapStateToProps(state) {
    return {
        position: state.homeReducer.position,
        toiletsList: state.homeReducer.toiletsList
    };
}

const styles = StyleSheet.create({
    searchBarMap: {
        position: 'absolute',
    },
    searchBar: {
        top: '1%',
        left: '1%',
        borderRadius: 5,
        width: '98%',
    },
    clearButton: {
        paddingRight: '4%'
    }
});

export default connect(mapStateToProps)(HomeView);