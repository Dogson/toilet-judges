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

class ReviewFormView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: this.props.navigation.getParam('rating'),
            toilet: this.props.navigation.getParam('toilet'),
            toiletPlace: this.props.navigation.getParam('toiletPlace'),
            hasMixtToilet: -1
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    _handlePressRadioButtonMixtToilets(value) {
        this.setState({hasMixtToilet: value});
    }

    renderStepOne() {
        let genderName;
        switch (this.state.toilet.gender) {
            case GENDERS.MAN:
                genderName = "Hommes";
                break;
            case GENDERS.WOMAN:
                genderName = "Femmes";
                break;
            case GENDERS.MIXT:
                genderName = "Mixtes";
                break;
        }
        const booleanOptions = [
            {
                label: 'Oui',
                value: true
            },
            {
                label: 'Non',
                value: false
            },
            {
                label: 'Ne sait pas',
                value: -1
            }
        ];
        return <View style={{backgroundColor: 'white'}}>
            <View style={{paddingLeft: 15}}>
                <Text style={[GlobalStyles.secondaryText, styles.stepNumber]}>Étape 1/2</Text>
                <Text style={[GlobalStyles.titleText, styles.titleContainer]}>
                    Partagez quelques infos sur ces toilettes
                </Text>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View style={[GlobalStyles.flexRowSpaceBetween, GlobalStyles.sectionContainer]}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Établissement</Text>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>{this.state.toiletPlace.placeName}</Text>
                </View>
                <TouchableNativeFeedback>
                    <View style={[GlobalStyles.flexRowSpaceBetween, GlobalStyles.sectionContainer]}>
                        <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Sexe</Text>
                        <Text
                            style={[GlobalStyles.primaryText, GlobalStyles.pressableText, {marginTop: 5}]}>{genderName}</Text>
                    </View>
                </TouchableNativeFeedback>
                <View style={[GlobalStyles.sectionContainer, GlobalStyles.flexColumnCenter]}>
                    <Text style={GlobalStyles.primaryText}>Les toilettes sont-elles exclusivement mixtes ?</Text>
                    <View style={{alignSelf: 'stretch', marginVertical: 5}}>
                    <FormRadioButtons
                        onPress={(value) => this._handlePressRadioButtonMixtToilets(value)}
                        options={booleanOptions}
                        checked={this.state.hasMixtToilet}
                        textStyle={GlobalStyles.secondaryText}
                        flexDirection='row'
                    />
                    </View>
                </View>
            </View>
        </View>
    }

    render() {
        return this.renderStepOne()
    }

    // HANDLING EVENTS
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
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

export default ReviewFormView;