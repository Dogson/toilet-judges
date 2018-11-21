// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, ScrollView, View, Alert, StyleSheet, TouchableNativeFeedback, ActivityIndicator} from 'react-native';
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
import {YesNoDialog} from "../../../widgets/dialogs/YesNoDialog";
import {RadioButtonDialog} from "../../../widgets/dialogs/RadioButtonDialog";
import {ERROR_TYPES} from "../../../../config/errorTypes";
import {ROUTE_NAMES} from "../../../../config/routes";

class ReviewFormView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: this.props.navigation.getParam('rating')
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    renderStepOne() {
        return <View>
            <Text style={GlobalStyles.secondaryText}>Étape 1/2</Text>
            <Text style={GlobalStyles.titleText}>Partagez quelques informations sur ces toilettes</Text>


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

export default ReviewFormView;