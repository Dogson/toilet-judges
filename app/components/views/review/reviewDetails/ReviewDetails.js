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

class ReviewDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userRating: this.props.navigation.getParam('userRating'),
            _handleAddReviewButtonPress: this.props.navigation.getParam('_handleAddReviewButtonPress')
        };

        this._handleEditReviewPress = this._handleEditReviewPress.bind(this);
        this._handleDeleteReviewPress = this._handleDeleteReviewPress.bind(this);
        this._handleDeleteReviewConfirm = this._handleDeleteReviewConfirm.bind(this);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            handleEdit: this._handleEditReviewPress,
            handleDelete: this._handleDeleteReviewPress
        });
    }

    _handleEditReviewPress() {
        this.state._handleAddReviewButtonPress();
    }

    _handleDeleteReviewPress() {
        Alert.alert(
            "",
            'Voulez-vous vraiment supprimer votre avis ?',
            [
                {text: 'Non', style: 'cancel'},
                {text: 'Oui', onPress: this._handleDeleteReviewConfirm},
            ]
        )
    }

    _handleDeleteReviewConfirm() {
        this.props.navigation.goBack(null);
        this.props.navigation.getParam('onDeleteReview')();
    }

    renderAccessibleDetail() {
        let accessible = this.state.userRating.isAccessible;
        if (accessible == null) {
            return;
        }
        accessible = {
            text: accessible ? 'Accès handicappé' : 'Aucun accès \n handicappé',
            color: accessible ? STYLE_VAR.backgroundDefault : STYLE_VAR.backgroundLightGray
        };


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
        let mixed = this.state.userRating.isMixed;
        if (mixed == null) {
            return;
        }
        mixed = {
            text: mixed ? 'Toilettes mixtes' : "Toilettes non mixtes",
            color: mixed ? STYLE_VAR.backgroundDefault : STYLE_VAR.backgroundLightGray
        };


        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon name="human-male-female"
                  reverse
                  type="material-community"
                  color={mixed.color}
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

