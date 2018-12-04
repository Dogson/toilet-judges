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
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";
import {ERROR_TYPES} from "../../../config/errorTypes";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints'

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
            showExitDialog: false,
            styles: StyleSheet.create({
                mapButton: {
                    position: 'absolute',
                    bottom: 20,
                    right: 20
                }
            }),
            focusInput: true,
            isReady: false
        };

        this._handleChangeText = this._handleChangeText.bind(this);
        this._handleChangeText = _.debounce(this._handleChangeText, 500);

        this._handlePressToilet = this._handlePressToilet.bind(this);
        this._handleKeyboardSpacerToggle = this._handleKeyboardSpacerToggle.bind(this);
        this._handlePressMap = this._handlePressMap.bind(this);
    }

    componentDidMount() {
        this.getNearbyToilets();
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

    _handlePressToilet(toilet) {
        this.props.navigation.navigate(ROUTE_NAMES.TOILET, {
            placeId: toilet._id,
            placeName: toilet.placeName,
            placeType: toilet.placeType
        });
    }

    _handlePressMap() {
        this.props.navigation.navigate(ROUTE_NAMES.MAP, {
            transition: TRANSITIONS.FROM_BOTTOM
        });
    }

    getNearbyToilets = () => {
        this.setState({isReady: false});
        ToiletEndpoints.getAllToilets()
            .then((toilets) => {
                this.setState({isReady: true});
                if (toilets) {
                    this.props.dispatch({type: ACTIONS_SEARCH.SET_TOILETS_LIST, value: toilets});
                }
            })
            .catch((err) => {
                this.setState({isReady: true});
                if (err.errorType === ERROR_TYPES.NOT_LOGGED) {
                    this.backToLoginView();
                }
            });
    };

    getToiletsBySearch() {
        this.setState({isReady: false});
        ToiletEndpoints.getToiletsFromSearch(this.state.searchQuery)
            .then((toilets) => {
                this.setState({isReady: true});
                if (toilets) {
                    this.props.dispatch({type: ACTIONS_SEARCH.SET_TOILETS_LIST, value: toilets});
                }
            })
            .catch((err) => {
                this.setState({isReady: true});
                if (err.errorType === ERROR_TYPES.NOT_LOGGED) {
                    this.backToLoginView();
                }
            });
    }

    // RENDERING COMPONENTS
    renderLoading() {
        return (
            <ActivityIndicator size="large"/>
        )
    }

    renderSearchResults() {
        if (!this.state.isReady) {
            return <View style={[GlobalStyles.container, GlobalStyles.flexColumnCenter, {marginTop: 28, flex: 1}]}>{this.renderLoading()}</View>
        }
        else {
            return <SearchResults searchQuery={this.state.searchQuery} toiletsList={this.props.toiletsList || []}
                                  _handlePressToilet={this._handlePressToilet}/>
        }

    };

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
        let searchResults;
        let mapIcon = this.renderMapIcon();
        let searchBarStyle = [styles.searchBar];
        searchResults = this.renderSearchResults();
        result =
            <View style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: StatusBar.currentHeight
            }}>
                <NavigationEvents
                    onWillFocus={payload => this.onViewFocused(payload)}
                />
                <View style={searchBarStyle}>
                    <SearchBar
                        ref={search => this.search = search}
                        platform={APP_CONFIG.platform}
                        placeholder='Rechercher un restaurant, bar...'
                        onChangeText={(searchQuery) => this._handleChangeText(searchQuery)}
                        onCancel={() => {
                            this.props.navigation.goBack(null)
                        }}
                        containerStyle={[styles.searchBar]}
                        rightIconContainerStyle={styles.clearButton}
                        inputStyle={GlobalStyles.primaryText}/>
                </View>
                {searchResults}
                {mapIcon}
                <KeyboardSpacer onToggle={(toggle, height) => this._handleKeyboardSpacerToggle(toggle, height)}/>
            </View>;
        return result;
    }
}


function mapStateToProps(state) {
    return {
        toiletsList: state.searchReducer.toiletsList
    };
}

const styles = StyleSheet.create({
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