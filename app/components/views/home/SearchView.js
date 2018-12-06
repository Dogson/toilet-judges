// LIBRAIRIES

import {PLACE_TYPES} from "../../../config/const";

let _ = require('lodash');
import React from 'react';
import {MapView} from 'expo';
import {connect} from "react-redux";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    BackHandler,
    StatusBar,
    Image,
    TouchableNativeFeedback
} from "react-native";
import {SearchBar, Icon} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import NavigationEvents from "react-navigation/src/views/NavigationEvents";
import {DeviceStorage} from "../../../helpers/deviceStorage";

//COMPONENTS
import {SearchResults} from '../../widgets/search/SearchResults';
import {YesNoDialog} from '../../widgets/dialogs/YesNoDialog'

//CONST
import {ACTIONS_ROOT} from "../root/RootActions";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";

//STYLE
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";

export default class SearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: StyleSheet.create({
                mapButton: {
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }
            }),
            position: {
                coords: {
                    latitude: null,
                    longitude: null
                }
            }
        };

        this._handleKeyboardSpacerToggle = this._handleKeyboardSpacerToggle.bind(this);
        this._handlePressMap = this._handlePressMap.bind(this);

        this.renderRightButton = this.renderRightButton.bind(this);
        this.renderLeftButton = this.renderLeftButton.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        if (!this.state.position.coords.latitude)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (this.mounted) {
                        this.setState({position: position});
                    }

                }, (error) => {
                    console.log(error);
                });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //HANDLING EVENTS
    backToLoginView() {
        DeviceStorage.deleteJWT().then(() => {
            this.props.dispatch({type: ACTIONS_ROOT.DELETE_JWT});
        });
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

    _handlePressMap() {
        this.props.navigation.navigate(ROUTE_NAMES.MAP, {
            transition: TRANSITIONS.FROM_BOTTOM
        });
    }

    // RENDERING COMPONENTS
    renderLeftButton() {
        let _this = this;
        function doAction() {
            _this.props.navigation.goBack(null);
        }

        return <TouchableNativeFeedback onPress={doAction}><View
            style={{justifyContent: 'center', paddingHorizontal: 15, paddingTop: 7.5}}><Icon
            name="arrow-back"
            iconStyle={{color: STYLE_VAR.text.color.primary}}
        ></Icon></View></TouchableNativeFeedback>
    }

    renderRightButton() {
        let _this = this;

        function clearInput() {
            _this.search.setAddressText("");
            _this.search._request("");
        }

        if (this.search && this.search.getAddressText() && this.search.getAddressText().length > 0) {
            return <TouchableNativeFeedback onPress={clearInput}><View
                style={{justifyContent: 'center', paddingHorizontal: 15, paddingTop: 7.5}}><Icon
                name="close"
                iconStyle={{color: STYLE_VAR.text.color.primary}}
            ></Icon></View></TouchableNativeFeedback>
        }
        return null;
    }

    renderMapIcon() {
        if (!this.state.isReady)
            return;
        return <View style={this.state.styles.mapButton}>
            <Icon name="map"
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
        let mapIcon = this.renderMapIcon();
        result = <View style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: StatusBar.currentHeight
            }}>
                <GooglePlacesAutocomplete
                    ref={search => this.search = search}
                    placeholder='Rechercher un établissement'
                    minLength={2} // minimum length of text to search
                    autoFocus={true}// Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                    listViewDisplayed='auto'  // true/false/undefined
                    fetchDetails={true}
                    renderDescription={row => row.description || row.formatted_address || row.name}// custom description render
                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                        let place = {
                            id: details.place_id,
                            name: details.name,
                            type: details.types.find((type) => {
                                return PLACE_TYPES.map((place_type) => {
                                    return place_type.id;
                                }).includes(type);
                            })
                        };

                        this.props.navigation.navigate(ROUTE_NAMES.TOILET, {place: place});

                    }}
                    getDefaultValue={() => ''}
                    query={{
                        // available options: https://developers.google.com/places/web-service/autocomplete
                        key: 'AIzaSyAgIyeHg-lrGIJyMD04jw6R7HYURNLvWYY',
                        language: 'fr', // language of the result
                        types: 'establishment',
                        location: this.state.position.coords.latitude + "," + this.state.position.coords.longitude,
                        radius: 500
                        // default: 'geocode'
                    }}
                    styles={{
                        textInputContainer: [GlobalStyles.container, {height: 50, alignItems: 'center', paddingBottom: 7.5}],
                        textInput: GlobalStyles.primaryText,
                        description: GlobalStyles.primaryText,
                        separator: {
                            paddingHorizontal: 10
                        },
                        row: {height: 'auto', marginRight: 10},
                        listView: GlobalStyles.container,
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        }
                    }}
                    currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                    currentLocationLabel="Current location"
                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                    GooglePlacesSearchQuery={{
                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                        rankby: 'distance',
                        types: 'establishment'
                    }}
                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    renderLeftButton={this.renderLeftButton}
                    renderRightButton={this.renderRightButton}
                />
                {/*{searchResults}*/}
                {/*{mapIcon}*/}
                <KeyboardSpacer onToggle={(toggle, height) => this._handleKeyboardSpacerToggle(toggle, height)}/>
            </View>;
        return result;
    }
}