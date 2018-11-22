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

class ReviewStepOne extends React.Component {
    constructor(props) {
        super(props);
        let rating = this.props.navigation.getParam('rating');
        if (!rating) {
            rating = {
                hasMixtToilets: 1,
                hasHandicappedToilets: 1
            }
        }
        if (rating.hasMixtToilets == null) {
            rating.hasMixtToilets = -1;
        }
        if (rating.hasHandicappedToilets == null) {
            rating.hasHandicappedToilets = -1;
        }
        this.state = {
            rating: rating,
            toilets: this.props.navigation.getParam('toilets'),
            toiletPlace: this.props.navigation.getParam('toiletPlace'),
            currentToiletIndex: this.props.navigation.getParam('currentToiletIndex')
        };
        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handlePressRadioButtonMixtToilets = this._handlePressRadioButtonMixtToilets.bind(this);
        this._handlePressRadioButtonHandicappedToilets = this._handlePressRadioButtonHandicappedToilets.bind(this);
        this._handleGenderChangeButtonPress = this._handleGenderChangeButtonPress.bind(this);
        this._handleChangeGenderConfirm = this._handleChangeGenderConfirm.bind(this);
        this._handlePressSubmit = this._handlePressSubmit.bind(this);
    }


    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handlePressRadioButtonMixtToilets(value) {
        this.setState(prevState => ({
            rating: {
                ...prevState.rating,
                hasMixtToilets: value
            }
        }))
    }

    _handlePressRadioButtonHandicappedToilets(value) {
        this.setState(prevState => ({
            rating: {
                ...prevState.rating,
                hasHandicappedToilets: value
            }
        }))
    }

    _handleGenderChangeButtonPress() {
        this.setState({showGenderPopup: true});
    }

    _handleChangeGenderConfirm(gender) {
        this.setToiletGender(gender);
        this.setState({showGenderPopup: false});
    }

    _handlePressSubmit() {
        //todo navigate
    }

    setToiletGender(toiletGender) {
        let index = this.state.toilets.findIndex((toilet) => {
            return toilet.gender === toiletGender;
        });
        this.setState({currentToiletIndex: index});
    }

    renderGenderPopup() {
        const genders = this.state.toilets.map((toilet) => {
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
                label: genderText
            }
        });
        const genderChecked = this.state.toilets[this.state.currentToiletIndex].gender;
        return <RadioButtonDialog visible={this.state.showGenderPopup}
                                  title="Afficher les toilettes : "
                                  options={genders}
                                  checked={genderChecked}
                                  cancel={() => this.setState({showGenderPopup: false})}
                                  onPressRadioButton={(option) => {
                                      this._handleChangeGenderConfirm(option)
                                  }}/>
    }

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
                    }]}/>
            </View>
        )
    }

    renderBody() {
        let toilet = this.state.toilets[this.state.currentToiletIndex];
        let genderName;
        switch (toilet.gender) {
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
        const booleanOptionsMixt = [
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
        const booleanOptionsHandicapped = JSON.parse(JSON.stringify(booleanOptionsMixt));

        return <ScrollView style={{flex: .8, marginBottom: 70}}
                           overScrollMode="always">
            {this.renderGenderPopup()}
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
                <TouchableNativeFeedback onPress={this._handleGenderChangeButtonPress}>
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
                            options={booleanOptionsMixt}
                            checked={this.state.rating.hasMixtToilets}
                            textStyle={GlobalStyles.secondaryText}
                            flexDirection='row'
                        />
                    </View>
                </View>
                <View style={[GlobalStyles.sectionContainer, GlobalStyles.flexColumnCenter, {borderBottomWidth: 0}]}>
                    <Text style={GlobalStyles.primaryText}>Existe-t-il des toilettes adaptées aux personnes handicappées
                        ?</Text>
                    <View style={{alignSelf: 'stretch', marginVertical: 5}}>
                        <FormRadioButtons
                            title="kek"
                            onPress={(value) => this._handlePressRadioButtonHandicappedToilets(value)}
                            options={booleanOptionsHandicapped}
                            checked={this.state.rating.hasHandicappedToilets}
                            textStyle={GlobalStyles.secondaryText}
                            flexDirection='row'
                        />
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
    }
});

export default ReviewStepOne;