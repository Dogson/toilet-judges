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
import {GENDERS, PLACE_TYPES} from "../../../../config/const";
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
import {NavigationActions} from "react-navigation";
import {ROUTE_NAMES} from "../../../../config/navigationConfig";

class ReviewStepThree extends React.Component {
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
        this._handleFinishRatingCleanliness = this._handleFinishRatingCleanliness.bind(this);
        this._handleFinishRatingFunctionality = this._handleFinishRatingFunctionality.bind(this);
        this._handleFinishRatingDecoration = this._handleFinishRatingDecoration.bind(this);
        this._handleFinishRatingValue = this._handleFinishRatingValue.bind(this);
    }


    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handlePressSubmit() {
        ToiletEndpoints.rateToilet(this.state.toilets[this.state.currentToiletIndex]._id, this.state.userRating)
            .then((toilet) => {
                this.props.navigation.goBack(this.props.navigation.getParam('screenKey'));
                this.props.navigation.getParam('onFinishRating')(this.state.currentToiletIndex);
            });
    }


    _handleFinishRatingCleanliness(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                rating: {
                    ...prevState.userRating.rating,
                    cleanliness: value
                }
            }
        }))
    }

    _handleFinishRatingFunctionality(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                rating: {
                    ...prevState.userRating.rating,
                    functionality: value
                }
            }
        }))
    }

    _handleFinishRatingDecoration(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                rating: {
                    ...prevState.userRating.rating,
                    decoration: value
                }
            }
        }))
    }

    _handleFinishRatingValue(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                rating: {
                    ...prevState.userRating.rating,
                    value: value
                }
            }
        }))
    }


    //RENDER COMPONENTS
    renderFooter() {
        const isButtonDisabled =  (!this.state.userRating.rating ||
                this.state.userRating.rating.cleanliness == null ||
                this.state.userRating.rating.functionality == null ||
                this.state.userRating.rating.decoration == null ||
                this.state.userRating.rating.value == null);

        return (
            <View style={GlobalStyles.footerContainer}>
                <Button
                    title="Suivant"
                    onPress={() => this._handlePressSubmit()}
                    buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                        paddingHorizontal: 10
                    }]}
                    disabled={isButtonDisabled}
                    titleStyle={GlobalStyles.defaultFont}/>
            </View>
        )
    }

    renderBody() {
        let toilet = this.state.toilets[this.state.currentToiletIndex];

        return <ScrollView style={{flex: .8, marginBottom: 70}}>
            <View style={{paddingHorizontal: 15}}>
                <Text style={[GlobalStyles.secondaryText, styles.stepNumber]}>Étape 3/3</Text>
                <Text style={[GlobalStyles.titleText, styles.titleContainer]}>
                    Détaillez votre expérience
                </Text>
                <View style={[GlobalStyles.flexColumn, styles.ratingSection]}>
                    <Text style={GlobalStyles.primaryText}>Propreté</Text>
                    <Text style={GlobalStyles.secondaryText}>État des toilettes, propreté du sol, odeurs...</Text>
                    <View style={styles.rating}>
                        <ToiletRating onFinishRating={this._handleFinishRatingCleanliness}
                                      rating={this.state.userRating.rating.cleanliness}
                                      size={30}/>
                    </View>
                </View>
                <View style={[GlobalStyles.flexColumn, styles.ratingSection]}>
                    <Text style={GlobalStyles.primaryText}>Équipements</Text>
                    <Text style={GlobalStyles.secondaryText}>Présence de savon, sèche-main, chasse d'eau fonctionnelle...</Text>
                    <View style={styles.rating}>
                        <ToiletRating onFinishRating={this._handleFinishRatingFunctionality}
                                      rating={this.state.userRating.rating.functionality}
                                      size={30}/>
                    </View>
                </View>
                <View>
                    <View style={[GlobalStyles.flexColumn, styles.ratingSection]}>
                        <Text style={GlobalStyles.primaryText}>Ambiance</Text>
                        <Text style={GlobalStyles.secondaryText}>Esthétique générale, décoration, musique...</Text>
                        <View style={styles.rating}>
                            <ToiletRating onFinishRating={this._handleFinishRatingDecoration}
                                          rating={this.state.userRating.rating.decoration}
                                          size={30}/>
                        </View>
                    </View>
                </View>
                <View style={[GlobalStyles.flexColumn, styles.ratingSection]}>
                    <Text style={GlobalStyles.primaryText}>Qualité/Prix</Text>
                    <Text style={GlobalStyles.secondaryText}>Si la pinte est à 13€, on peut s'attendre à des urinoirs en argent.</Text>
                    <View style={styles.rating}>
                        <ToiletRating onFinishRating={this._handleFinishRatingValue}
                                      rating={this.state.userRating.rating.value}
                                      size={30}/>
                    </View>
                </View>
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
    },
    rating: {
        paddingHorizontal: 30
    },
    ratingSection: {
        paddingBottom: 15
    }
});

export default ReviewStepThree;