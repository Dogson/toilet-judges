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
import {GlobalStyles} from '../../../../styles/styles'
import {ROUTE_NAMES} from "../../../../config/navigationConfig";

// API ENDPOINTS

//COMPONENTS
import {ToiletRating} from "../../../widgets/rating/ToiletRating";


class ReviewStepThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRating: this.props.navigation.getParam('userRating')
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
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_STEP_FOUR, {
            userRating: this.state.userRating,
            title: this.props.navigation.getParam('title'),
            onFinishRating: this.props.navigation.getParam('onFinishRating'),
            originRoute: this.props.navigation.getParam('originRoute'),
            callBackFn: this.props.navigation.getParam('callBackFn')
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
        const isButtonDisabled = (!this.state.userRating.rating ||
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
        return <ScrollView style={{flex: .8, marginBottom: 70}}>
            <View style={{paddingHorizontal: 15}}>
                <Text style={[GlobalStyles.secondaryText, styles.stepNumber]}>Étape 3/4</Text>
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
                    <Text style={GlobalStyles.secondaryText}>Présence de savon, sèche-main, chasse d'eau
                        fonctionnelle...</Text>
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
                    <Text style={GlobalStyles.secondaryText}>Si la pinte est à 13€, on peut s'attendre à des urinoirs en
                        argent.</Text>
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