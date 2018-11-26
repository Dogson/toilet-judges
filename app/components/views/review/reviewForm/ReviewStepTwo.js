// LIBRAIRIES
import React from 'react';
import {
    BackHandler,
    Text,
    ScrollView,
    View,
    Alert,
    StyleSheet,
    TouchableNativeFeedback,
    ActivityIndicator
} from 'react-native';
import {connect} from "react-redux";
import {Icon, Button} from 'react-native-elements';

// CONST
import {APP_CONFIG} from "../../../../config/appConfig"
import {GENDERS, PLACE_TYPES, RATINGS} from "../../../../config/const";
import {STYLE_VAR} from "../../../../styles/stylingVar";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../../endpoints/toiletEndpoints';

//COMPONENTS
import {GlobalRating} from "../../../widgets/rating/GlobalRating";
import {ToiletRating} from "../../../widgets/rating/ToiletRating";

//STYLES
import {GlobalStyles} from '../../../../styles/styles'
import {FormRadioButtons} from "../../../widgets/form/FormRadioButtons";
import {ACTIONS_TOILET} from "../../toilet/ToiletActions";
import {RadioButtonDialog} from "../../../widgets/dialogs/RadioButtonDialog";
import {ROUTE_NAMES} from "../../../../config/navigationConfig";

class ReviewStepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRating: this.props.navigation.getParam('userRating'),
            toilets: this.props.navigation.getParam('toilets'),
            toiletPlace: this.props.navigation.getParam('toiletPlace'),
            currentToiletIndex: this.props.navigation.getParam('currentToiletIndex'),
        };
        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handlePressSubmit = this._handlePressSubmit.bind(this);
        this._handleFinishRating = this._handleFinishRating.bind(this);
    }


    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handlePressSubmit() {
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_STEP_THREE, {
            currentToiletIndex: this.state.currentToiletIndex,
            userRating: this.state.userRating,
            toilets: this.state.toilets,
            toiletPlace: this.state.toiletPlace,
            title: this.props.navigation.getParam('title'),
            screenKey: this.props.navigation.getParam('screenKey'),
            onFinishRating: this.props.navigation.getParam('onFinishRating')
        });
    }

    _handleFinishRating(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                rating: {
                    ...prevState.userRating.rating,
                    global: value
                }
            }
        }))
    }

    //RENDER COMPONENTS
    renderFooter() {
        return (
            <View style={GlobalStyles.footerContainer}>
                <Button
                    title="Suivant"
                    onPress={() => this._handlePressSubmit()}
                    buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                        marginRight: 15,
                        paddingHorizontal: 10
                        // marginBottom: 15
                    }]}
                    disabled={!this.state.userRating.rating || this.state.userRating.rating.global == null}
                    titleStyle={GlobalStyles.defaultFont}/>
            </View>
        )
    }

    renderBody() {
        let ratingString = !!this.state.userRating.rating && this.state.userRating.rating.global ? RATINGS[this.state.userRating.rating.global] : '';
        let rating = ratingString !== "" ? this.state.userRating.rating.global : 0;

        return <ScrollView style={{flex: .8, marginBottom: 70}}>
            <View style={{paddingHorizontal: 15}}>
                <Text style={[GlobalStyles.secondaryText, styles.stepNumber]}>Étape 2/3</Text>
                <Text style={[GlobalStyles.titleText, styles.titleContainer]}>
                    Comment s'est déroulée votre expérience ?
                </Text>
                <View
                    style={{paddingHorizontal: 15}}>
                    <ToiletRating size={40}
                                  onFinishRating={this._handleFinishRating}
                                  rating={rating}/>
                </View>
                <Text style={[GlobalStyles.primaryText, {alignSelf: 'center', color: STYLE_VAR.text.color.secondary, fontSize: STYLE_VAR.text.size.big}]}>{ratingString}</Text>
            </View>
        </ScrollView>
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                {this.renderBody()}
                {this.renderFooter()}
            </View>)
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: 15,
        paddingBottom: 20,
        paddingRight: 40
    },
    stepNumber: {
        paddingTop: 15
    }
});

export default ReviewStepTwo;