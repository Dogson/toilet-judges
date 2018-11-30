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
import {PLACE_TYPES} from "../../../../config/const";
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

class ReviewStepOne extends React.Component {
    constructor(props) {
        super(props);
        let userRating = this.props.navigation.getParam('userRating');
        if (!userRating) {
            userRating = {
                isMixed: null,
                isAccessible: null,
                rating: null
            }
        }
        this.state = {
            userRating: userRating,
            placeName: this.props.navigation.getParam('placeName'),
            toiletId: this.props.navigation.getParam('toiletId'),
        };
        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handlePressRadioButtonMixedToilet = this._handlePressRadioButtonMixedToilet.bind(this);
        this._handlePressRadioButtonAccessibleToilet = this._handlePressRadioButtonAccessibleToilet.bind(this);
        this._handlePressSubmit = this._handlePressSubmit.bind(this);
    }


    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handlePressRadioButtonMixedToilet(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                isMixed: value
            }
        }))
    }

    _handlePressRadioButtonAccessibleToilet(value) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                isAccessible: value
            }
        }))
    }

    _handlePressSubmit() {
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_STEP_TWO, {
            userRating: this.state.userRating,
            title: this.props.navigation.getParam('title'),
            onFinishRating: this.props.navigation.getParam('onFinishRating')
        });
    }

    renderFooter() {
        return (
            <View style={GlobalStyles.footerContainer}>
                <Button
                    title="Suivant"
                    onPress={() => this._handlePressSubmit()}
                    buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                        paddingHorizontal: 10
                    }]}
                    titleStyle={GlobalStyles.defaultFont}/>
            </View>
        )
    }

    renderBody() {
        const booleanOptionsMixed = [
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
                value: null
            }
        ];
        const booleanOptionsAccessible = JSON.parse(JSON.stringify(booleanOptionsMixed));

        return <ScrollView style={{flex: .8, marginBottom: 70}}>
            <View style={{paddingLeft: 15}}>
                <Text style={[GlobalStyles.secondaryText, styles.stepNumber]}>Étape 1/3</Text>
                <Text style={[GlobalStyles.titleText, styles.titleContainer]}>
                    Partagez quelques infos sur ces toilettes
                </Text>
            </View>
            <View style={GlobalStyles.flexColumn}>
                <View style={[GlobalStyles.flexRowSpaceBetween, GlobalStyles.sectionContainer]}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Établissement</Text>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>{this.state.placeName}</Text>
                </View>
                <View style={[GlobalStyles.sectionContainer, GlobalStyles.flexColumnCenter]}>
                    <Text style={[GlobalStyles.primaryText, {alignSelf: 'flex-start'}]}>Les toilettes sont-elles mixtes ?</Text>
                    <View style={{alignSelf: 'stretch', marginVertical: 5}}>
                        <FormRadioButtons
                            onPress={(value) => this._handlePressRadioButtonMixedToilet(value)}
                            options={booleanOptionsMixed}
                            checked={this.state.userRating.isMixed}
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
                            onPress={(value) => this._handlePressRadioButtonAccessibleToilet(value)}
                            options={booleanOptionsAccessible}
                            checked={this.state.userRating.isAccessible}
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