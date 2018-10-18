// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, View, Alert, StyleSheet, TouchableNativeFeedback, ActivityIndicator} from 'react-native';
import {connect} from "react-redux";
import {Icon} from 'react-native-elements';

// CONST
import {APP_CONFIG} from "../../../config/appConfig"
import {GENDERS, PLACE_TYPES} from "../../../config/const";
import {ACTIONS_TOILET} from "./ToiletActions";
import {STYLE_VAR} from "../../../config/stylingVar";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints';

//COMPONENTS
import {GlobalRating} from "../../rating/GlobalRating";

//STYLES
import {GlobalStyles} from '../../../styles/styles'
import {YesNoDialog} from "../../dialogs/YesNoDialog";
import {RadioButtonDialog} from "../../dialogs/RadioButtonDialog";

class ToiletView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);
        this.state =
            {
                toiletPlace: this.props.navigation.getParam('toiletPlace'),
                userGender: APP_CONFIG.defaultGender
            };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.handleGenderChangeButtonPress = this.handleGenderChangeButtonPress.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        this.getToilets();
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
        this.setState({showGenderPopup: true});
    }

    handleChangeGender(gender) {
        this.setToiletGender(gender);
        this.setState({showGenderPopup: false});
    }

    // DISPATCH ACTIONS
    getToilets() {
        ToiletEndpoints.getToilets(this.state.toiletPlace._id)
            .then((toilets) => {
                this.props.dispatch({type: ACTIONS_TOILET.SET_TOILETS, value: toilets});
                this.setToiletGender(this.state.userGender);
            });
    }

    setToiletGender(toiletGender) {
        let index = this.props.toilets.findIndex((toilet) => {
            return toilet.gender === toiletGender;
        });
        if (index === -1) {
            index = this.props.toilets.findIndex((toilet) => {
                return toilet.gender === GENDERS.MIXT;
            });
        }
        this.props.dispatch({type: ACTIONS_TOILET.SET_CURRENT_TOILET, value: index})
    }

    // RENDERING COMPONENTS
    renderRating(toilet) {
        const rating = toilet.rating || {};
        return <GlobalRating rating={rating}
                             ratingCount={toilet.ratingCount}></GlobalRating>

    }

    renderPlaceType() {
        let iconName;
        switch (this.state.toiletPlace.placeType) {
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
                      size={20}/>
                <Text style={[GlobalStyles.secondaryText, styles.descriptionLineItem]}>
                    {this.state.toiletPlace.placeType}
                </Text>
            </View>
        );
    }

    renderGender() {
        let genderName;
        let iconName;
        switch (this.props.toilets[this.props.currentToiletIndex].gender) {
            case GENDERS.MAN:
                genderName = "Hommes";
                iconName = "human-male";
                break;
            case GENDERS.WOMAN:
                genderName = "Femmes";
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
                          size={20}/>
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

    renderToiletDetails() {
        const toilet = this.props.toilets[this.props.currentToiletIndex];
        return (
            <View style={GlobalStyles.stackContainer}>
                <View style={GlobalStyles.sectionContainer}>
                    <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                        {this.renderPlaceType()}
                        {this.renderGender()}
                    </View>
                </View>
                {this.renderGenderPopup()}
                <View style={GlobalStyles.sectionContainer}>
                    {this.renderRating(toilet)}
                </View>
            </View>
        );
    }

    renderLoading() {
        return (
            <ActivityIndicator size="large"/>
        )
    }

    renderNoToilets() {
        return (
            <Text>Pas de toilettes</Text>
        )
    }

    renderNoGender() {
        return (
            <Text>Aucune toilette pour votre genre</Text>
        )
    }

    renderGenderPopup() {
        const genders = this.props.toilets.map((toilet) => {
            let genderText;
            switch (toilet.gender) {
                case GENDERS.MAN :
                    genderText = "Hommes";
                    break;
                case GENDERS.WOMAN :
                    genderText = "Femmes";
                    break;
                default:
                    genderText = "Mixtes"
            }
            return {
                value: toilet.gender,
                text: genderText
            }
        });
        const genderChecked = this.props.toilets[this.props.currentToiletIndex].gender;
        return <RadioButtonDialog visible={this.state.showGenderPopup}
                                  title="Afficher les toilettes : "
                                  options={genders}
                                  defaultChecked={genderChecked}
                                  cancel={() => this.setState({showGenderPopup: false})}
                                  onPressRadioButton={(option) => {
                                      this.handleChangeGender(option)
                                  }}/>
    }

    render() {
        let body;
        let containerStyle = {};
        if (!this.props.isReady) {
            body = this.renderLoading();
            containerStyle = GlobalStyles.loading;
        }
        else if (this.props.toilets.length === 0) {
            body = this.renderNoToilets();
            containerStyle = styles.backgroundStyle
        }
        else if (this.props.currentToiletIndex === -1) {
            body = this.renderNoGender();
            containerStyle = styles.backgroundStyle;
        }
        else {
            body = this.renderToiletDetails();
        }
        return <View style={containerStyle} key={this.state.toiletPlace._id}>{body}</View>;
    }
}

function mapStateToProps(state) {
    return {
        toilets: state.toiletReducer.toilets,
        currentToiletIndex: state.toiletReducer.currentToiletIndex,
        isReady: state.toiletReducer.isReady
    };
}


const styles = StyleSheet.create({
    descriptionBlock: {flexDirection: "column", paddingBottom: 7, alignItems: 'center'},
    backgroundStyle: {
        backgroundColor: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        width: '100%'
    }
});

export default connect(mapStateToProps)(ToiletView);