// LIBRAIRIES
import React from 'react';
import {MapView} from 'expo';
import {connect} from "react-redux";
import {View, Text, StyleSheet, ActivityIndicator, BackHandler, StatusBar, Image} from "react-native";
import {SearchBar, Icon} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';

let _ = require('lodash');
// CONST
import {APP_CONFIG} from "../../../config/appConfig";
import {ACTIONS_SEARCH} from "./SearchActions";
import {ACTIONS_ROOT} from "../root/RootActions";
import {ROUTE_NAMES} from "../../../config/navigationConfig";
import {ERROR_TYPES} from "../../../config/errorTypes";

// API ENDPOINTS
import {ToiletPlacesListEndpoints} from '../../../endpoints/toiletPlacesListEndpoints'

//COMPONENTS
import {SearchResults} from '../../widgets/search/SearchResults';
import {YesNoDialog} from '../../widgets/dialogs/YesNoDialog'

//STYLE
import {GlobalStyles} from "../../../styles/styles";
import {DeviceStorage} from "../../../helpers/deviceStorage";
import {STYLE_VAR} from "../../../styles/stylingVar";
import NavigationEvents from "react-navigation/src/views/NavigationEvents";

class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMap: false,
            showExitDialog: false,
            styles: StyleSheet.create({
                mapButton: {
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }
            }),
            focusInput: true
        };

        this._handleChangeText = this._handleChangeText.bind(this);
        this._handleChangeText = _.debounce(this._handleChangeText, 500);

        this._handlePressToilet = this._handlePressToilet.bind(this);
        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handleKeyboardSpacerToggle = this._handleKeyboardSpacerToggle.bind(this);
        this._handlePressMap = this._handlePressMap.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
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

        this.setState({marginBottom: 1});

        this.getNearbyToilets();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    onViewFocused(payload) {
        // automatically open up keyboard if user comes from Home View
        if (!payload.lastState) {
            this.search.focus();
        }
    }

    //HANDLING EVENTS
    backToLoginView() {
        DeviceStorage.deleteJWT().then(() => {
            this.props.dispatch({type: ACTIONS_ROOT.DELETE_JWT});
        });
    }

    _handleBackButtonClick() {
        if (this.state.showMap) {
            this.setState({showMap: false});
        }
        else {
            this.props.navigation.goBack(null);
        }
        return true;
    }

    _handleKeyboardSpacerToggle(toggle, height) {
        let bottom = 20;
        if (toggle) {
            bottom += height;
        }
        this.setState({
            styles: StyleSheet.create({
                mapButton: {
                    position: 'absolute',
                    bottom: bottom,
                    right: 20
                }
            })
        });
    }


    _handleChangeText(searchQuery) {
        this.setState({...this.state, searchQuery});
        this.getToiletsBySearch();
    }

    _handlePressToilet(toiletPlace) {
        this.props.navigation.navigate(ROUTE_NAMES.TOILET, {
            toiletPlace: toiletPlace
        });
    }

    _handlePressMap() {
        if (!this.state.showMap)
            this.search.blur();
        this.setState({showMap: !this.state.showMap});
    }

    // DISPATCH ACTIONS
    setMapPosition = (position) => {
        this.props.dispatch({type: ACTIONS_SEARCH.SET_POSITION, value: position});
    };

    getNearbyToilets = () => {
        ToiletPlacesListEndpoints.getAllPlaces()
            .then((toilets) => {
                if (toilets) {
                    this.props.dispatch({type: ACTIONS_SEARCH.SET_TOILETS_LIST, value: toilets});
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
                    this.props.dispatch({type: ACTIONS_SEARCH.SET_TOILETS_LIST, value: toilets});
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
                              _handlePressToilet={this._handlePressToilet}/>
    };

    renderMapOrListIcon() {
        let iconName = 'map';
        if (this.state.showMap) {
            iconName = 'format-list-bulleted';
        }
        return <View style={this.state.styles.mapButton}>
            <Icon name={iconName}
                  color={STYLE_VAR.backgroundDefault}
                  raised={true}
                  reverse
                  onPress={() => {
                      this._handlePressMap()
                  }}
            />
        </View>
    }

    render() {
        let result;
        let map;
        let searchResults;
        let loading;
        let mapIcon = this.renderMapOrListIcon();
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
            searchResults = this.renderSearchResults()

        result =
            <View style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: StatusBar.currentHeight
            }}>
                <NavigationEvents
                    onWillFocus={payload => this.onViewFocused(payload)}
                />
                {map}
                <View style={searchBarStyle}>
                    <SearchBar
                        ref={search => this.search = search}
                        platform={APP_CONFIG.platform}
                        onTouchStart={() => this.setState({showMap: false})}
                        placeholder='Rechercher un restaurant, bar...'
                        onChangeText={(searchQuery) => this._handleChangeText(searchQuery)}
                        onCancel={() => {
                            this.props.navigation.goBack(null)
                        }}
                        containerStyle={[styles.searchBar]}
                        rightIconContainerStyle={styles.clearButton}
                        inputStyle={GlobalStyles.primaryText}/>
                </View>
                {loading}
                {searchResults}
                {mapIcon}
                <KeyboardSpacer onToggle={(toggle, height) => this._handleKeyboardSpacerToggle(toggle, height)}/>
            </View>;
        return result;
    }
}


function mapStateToProps(state) {
    return {
        position: state.searchReducer.position,
        toiletsList: state.searchReducer.toiletsList
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

export default connect(mapStateToProps)(SearchView);