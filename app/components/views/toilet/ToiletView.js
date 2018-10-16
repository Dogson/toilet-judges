// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, View, Alert, StyleSheet, TouchableNativeFeedback} from 'react-native';
import {connect} from "react-redux";
import {Icon} from 'react-native-elements';

// CONST
import {GENDERS, PLACE_TYPES} from "../../../config/const";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints';
import {Header} from "react-native-elements";

//COMPONENTS
import {GlobalRating} from "../../rating/GlobalRating";

//STYLES
import {GlobalStyles} from '../../../styles/styles'
import {APP_CONFIG} from "../../../config/appConfig";
import {STYLE_VAR} from "../../../config/stylingVar";

class ToiletView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);
        this.state =
            {
                toiletInfos: this.props.navigation.getParam('toilet')
            };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleGenderChangeButtonPress = this.handleGenderChangeButtonPress.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    // HANDLING EVENTS
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    handleGenderChangeButtonPress() {
        Alert.alert("Changing gender...");
    }

    // DISPATCH ACTIONS

    // RENDERING COMPONENTS
    renderPlaceType() {
        let iconName;
        switch (this.state.toiletInfos.placeType) {
            case PLACE_TYPES.RESTAURANT:
                iconName = 'restaurant';
                break;
            case PLACE_TYPES.BAR:
                iconName = 'local-bar';
                break;
            case PLACE_TYPES.CINEMA:
                iconName = 'local-movies';
                break;
            case PLACE_TYPES.HOTEL:
                iconName = 'hotel';
                break;
            default:
                return;
        }
        return (
            <View style={styles.descriptionBlock}>
                <Icon reverse name={iconName}
                      color={STYLE_VAR.backgroundDefault}
                      containerStyle={styles.descriptionLineItem}
                      size={20} />
                <Text style={[GlobalStyles.secondaryText, styles.descriptionLineItem]}>
                    {this.state.toiletInfos.placeType}
                </Text>
            </View>
        );
    }

    renderGender() {
        let genderName;
        let iconName;
        switch (this.state.toiletInfos.gender) {
            case GENDERS.MAN:
                genderName = "Hommes";
                iconName = "human-male";
                break;
            case GENDERS.WOMAN:
                genderName = "Hommes";
                iconName = "human-female";
                break;
            case GENDERS.MIXT:
                genderName = "Mixtes";
                iconName = "human-male-female";
                break;
            default:
                return;
        }
        return (
            <TouchableNativeFeedback
                onPress={this.handleGenderChangeButtonPress}>
                <View style={styles.descriptionBlock}>
                    <Icon reverse name={iconName}
                          type="material-community"
                          color={STYLE_VAR.backgroundDefault}
                          containerStyle={styles.descriptionLineItem}
                          size={20} />
                    <Text style={[GlobalStyles.secondaryText, styles.descriptionLineItem]}>
                        {genderName}
                    </Text>
                    <Text style={[GlobalStyles.secondaryText, GlobalStyles.pressableText, styles.descriptionLineItem]}>
                        Changer
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    }

    render() {
        return (
            <View style={GlobalStyles.stackContainer}>
                <View style={GlobalStyles.sectionContainer}>
                    <GlobalRating rating={this.state.toiletInfos.globalRating}
                                  ratingCount={this.state.toiletInfos.ratingCount}></GlobalRating>
                </View>
                <View style={GlobalStyles.sectionContainer}>
                    <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                        {this.renderPlaceType()}
                        {this.renderGender()}
                    </View>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {};
}


const styles = StyleSheet.create({
    descriptionBlock: {flexDirection: "column", paddingBottom: 7, alignItems: 'center'},
    descriptionLineItem: {}
});

export default connect(mapStateToProps)(ToiletView);