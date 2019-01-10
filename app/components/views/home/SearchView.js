// LIBRAIRIES
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableNativeFeedback
} from "react-native";
import {Icon} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";

//COMPONENTS

//CONST
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {PLACE_TYPES} from "../../../config/const";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";
import {APP_CONFIG} from "../../../config/appConfig";

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

        this.placesAutocompleteToken = this.createPlacesAutocompleteSessionToken()
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    createPlacesAutocompleteSessionToken(a) {
        return a
            ? (a ^ Math.random() * 16 >> a / 4).toString(16)
            : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.createPlacesAutocompleteSessionToken);
    };

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
            _this.props.navigation.openDrawer();
        }

        return <TouchableNativeFeedback onPress={doAction}><View
            style={{justifyContent: 'center', paddingHorizontal: 15, paddingTop: 7.5}}><Icon
            name="bars" type="font-awesome"
            size={20}
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

    renderRowDescription(row) {
        if (row.isPredefinedPlace)
            return <View key={row.place_id} style={{flex: 0.9}}><Text style={[GlobalStyles.primaryText, {color: '#1faadb'}]}>{row.description}</Text></View>;
        if (row.structured_formatting)
            return <View key={row.place_id} style={{flex: 0.9}}>
                <Text numberOfLines={1} style={GlobalStyles.primaryText}>{row.structured_formatting.main_text}</Text>
                <Text numberOfLines={1}
                      style={GlobalStyles.secondaryText}>{row.structured_formatting.secondary_text}</Text>
            </View>;
        return <View key={row.place_id} style={{flex: 0.9}}><Text style={GlobalStyles.primaryText}>{row.name}</Text></View>;
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
                isRowScrollable={false}
                numberOfLines={2}
                ref={search => this.search = search}
                placeholder='Rechercher un établissement'
                minLength={2} // minimum length of text to search
                autoFocus={true}// Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed='auto'  // true/false/undefined
                fetchDetails={true}
                renderRow={(row) => this.renderRowDescription(row)}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    let place = {
                        id: details.place_id,
                        name: details.name,
                        type: PLACE_TYPES.map((place_type) => {
                            return place_type.id
                        }).find((type) => {
                            return details.types.includes(type)
                        })
                    };

                    this.props.navigation.navigate(ROUTE_NAMES.TOILET, {place: place});
                    return false;
                }}
                getDefaultValue={() => ''}
                query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: APP_CONFIG.GooglePlaceAPIkey,
                    language: 'fr', // language of the result
                    types: 'establishment',
                    location: this.state.position.coords.latitude + "," + this.state.position.coords.longitude,
                    radius: 2000,
                    sessionToken: this.placesAutocompleteToken,
                    fields: 'address_component, adr_address, alt_id, formatted_address, geometry, icon, id, name, permanently_closed, photo, place_id, plus_code, scope, type, url, utc_offset, vicinity'
                    // default: 'geocode'
                }}
                styles={{
                    textInputContainer: [GlobalStyles.container, {
                        height: 'auto',
                        alignItems: 'center',
                        paddingBottom: 7.5
                    }],
                    textInput: [GlobalStyles.primaryText, {height: 'auto'}],
                    row: {height: 'auto'},
                    listView: GlobalStyles.container,
                    loader: {
                        alignSelf: 'center'
                    }
                }}
                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Établissements près de vous"
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
            {/*{mapIcon}*/}
            <KeyboardSpacer onToggle={(toggle, height) => this._handleKeyboardSpacerToggle(toggle, height)}/>
        </View>;
        return result;
    }
}