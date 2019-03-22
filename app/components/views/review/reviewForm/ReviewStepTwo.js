// LIBRAIRIES
import React from 'react';
import {
    Text,
    ScrollView,
    View,
    StyleSheet,
} from 'react-native';
import {Button} from 'react-native-elements';

// CONST
import {RATINGS} from "../../../../config/const";
import {STYLE_VAR} from "../../../../styles/stylingVar";
import {GlobalStyles} from '../../../../styles/styles'
import {ROUTE_NAMES} from "../../../../config/navigationConfig";

// API ENDPOINTS

//COMPONENTS
import {ToiletRating} from "../../../widgets/rating/ToiletRating";

class ReviewStepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRating: this.props.navigation.getParam('userRating'),
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
            userRating: this.state.userRating,
            title: this.props.navigation.getParam('title'),
            onFinishRating: this.props.navigation.getParam('onFinishRating'),
            originRoute: this.props.navigation.getParam('originRoute')
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
                        paddingHorizontal: 10
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