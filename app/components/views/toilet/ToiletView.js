// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, ScrollView, View, Alert, StyleSheet, TouchableNativeFeedback, ActivityIndicator} from 'react-native';
import {connect} from "react-redux";
import {Icon, Button} from 'react-native-elements';

// CONST
import {APP_CONFIG} from "../../../config/appConfig"
import {GENDERS, PLACE_TYPES} from "../../../config/const";
import {ACTIONS_TOILET} from "./ToiletActions";
import {STYLE_VAR} from "../../../styles/stylingVar";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints';

//COMPONENTS
import {GlobalRating} from "../../widgets/rating/GlobalRating";
import {ToiletRating} from "../../widgets/rating/ToiletRating";

//STYLES
import {GlobalStyles} from '../../../styles/styles'
import {YesNoDialog} from "../../widgets/dialogs/YesNoDialog";
import {RadioButtonDialog} from "../../widgets/dialogs/RadioButtonDialog";
import {ERROR_TYPES} from "../../../config/errorTypes";
import {ROUTE_NAMES} from "../../../config/routes";

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
        this.handleAddReviewButtonPress = this.handleAddReviewButtonPress.bind(this);
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

    handleChangeGenderConfirm(gender) {
        this.setToiletGender(gender);
        this.setState({showGenderPopup: false});
    }

    handleAddReviewButtonPress() {
        const toilet = this.props.toilets[this.props.currentToiletIndex];
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_FORM, {
            rating: toilet.userRating,
            toilet: toilet,
            toiletPlace: this.state.toiletPlace,
            title: toilet.userRating ? 'Modifier votre avis' : 'Donner votre avis'
        });
    }

    // DISPATCH ACTIONS
    getToilets() {
        ToiletEndpoints.getToilets(this.state.toiletPlace._id)
            .then((toilets) => {
                this.props.dispatch({type: ACTIONS_TOILET.SET_TOILETS, value: toilets});
                this.setToiletGender(this.state.userGender);
            })
            .catch((err) => {
                if (err.errorType === ERROR_TYPES.NOT_LOGGED) {
                    this.backToLoginView();
                }
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

    renderUserRating() {
        const toilet = this.props.toilets[this.props.currentToiletIndex];
        let buttonLabel = "Donner votre avis";
        let userRating;
        if (toilet.userRating) {
            buttonLabel = "Modifier votre avis";
            userRating = <ToiletRating rating={toilet.userRating.global} readonly={true} color={STYLE_VAR.backgroundSecondary}></ToiletRating>
        }

        return <View>
            {userRating}
            <Button title={buttonLabel}
                    onPress={() => this.handleAddReviewButtonPress()}
                    buttonStyle={GlobalStyles.primaryButton}
            ></Button>
        </View>


    }

    renderToiletDetails() {
        const toilet = this.props.toilets[this.props.currentToiletIndex];
        return (
            <ScrollView style={GlobalStyles.stackContainer}>
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
                <View style={GlobalStyles.sectionContainer}>
                    {this.renderUserRating()}
                </View>
            </ScrollView>
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
                                      this.handleChangeGenderConfirm(option)
                                  }}/>
    }

    render() {
        let body;
        let containerStyle = {flex: 1};
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