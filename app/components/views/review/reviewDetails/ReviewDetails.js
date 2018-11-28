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
import {ROUTE_NAMES} from "../../../../config/navigationConfig";

class ReviewDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userRating: this.props.navigation.getParam('userRating'),
            placeName: this.props.navigation.getParam('placeName'),
            gender: this.props.navigation.getParam('gender'),
            _handleAddReviewButtonPress: this.props.navigation.getParam('_handleAddReviewButtonPress')
        };

        this._handleAddReviewButtonPress = this._handleAddReviewButtonPress.bind(this);
    }

    _handleAddReviewButtonPress() {
        this.state._handleAddReviewButtonPress();
    }

    renderFooter() {
        return (
            <View style={GlobalStyles.footerContainer}>
                <Button
                    title="Modifier votre avis"
                    onPress={this._handleAddReviewButtonPress}
                    buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                        paddingHorizontal: 10
                    }]}
                    titleStyle={GlobalStyles.defaultFont}/>
            </View>
        )
    }

    renderAccessibleDetail() {
        let accessible = this.state.userRating.hasHandicappedToilets;
        if (accessible == null) {
            return;
        }
        if (accessible) {
            accessible = {
                text: 'Accès handicappé',
                color: STYLE_VAR.backgroundDefault
            }
        }
        else {
            accessible = {
                text: 'Aucun accès \n handicappé',
                color: STYLE_VAR.backgroundLightGray
            }
        }

        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon reverse
                  name="accessible"
                  color={accessible.color}
                  size={20}/>
            <Text style={[GlobalStyles.secondaryText]}>
                {accessible.text}
            </Text>
        </View>
    }

    renderMixedDetail() {
        let mixed = this.state.userRating.hasMixtToilets;
        if (mixed == null) {
            return;
        }
        if (mixed) {
            mixed = {
                text: 'Toilettes mixtes',
                iconName: 'human-male-female'
            }
        }
        else {
            let iconName;
            switch (this.state.gender) {
                case GENDERS.MAN:
                    iconName = "human-male";
                    break;
                case GENDERS.WOMAN:
                    iconName = "human-female";
                    break;
                default:
                    return;
            }

            mixed = {
                text: 'Non mixtes',
                iconName: iconName
            }
        }

        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon name={mixed.iconName}
                  reverse
                  type="material-community"
                  color={STYLE_VAR.backgroundDefault}
                  size={20}/>
            <Text style={[GlobalStyles.secondaryText]}>
                {mixed.text}
            </Text>
        </View>
    }

    render() {
        return <View style={styles.backgroundStyle}>
            <View style={{paddingHorizontal: 15}}>
                <View>
                    <Text style={GlobalStyles.titleText}>
                        Votre avis
                    </Text>
                </View>
                <GlobalRating rating={this.state.userRating.rating}/>
                <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                    {this.renderAccessibleDetail()}
                    {this.renderMixedDetail()}
                </View>
            </View>
            {this.renderFooter()}
        </View>
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        backgroundColor: 'white'
    }
});


export default ReviewDetails;

