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
import {APP_CONFIG} from "../../../config/appConfig"
import {PLACE_TYPES} from "../../../config/const";
import {ACTIONS_TOILET} from "./ToiletActions";
import {STYLE_VAR} from "../../../styles/stylingVar";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints';

//COMPONENTS
import {GlobalRating} from "../../widgets/rating/GlobalRating";
import {ToiletRating} from "../../widgets/rating/ToiletRating";

//STYLES
import {GlobalStyles} from '../../../styles/styles'
import {YesNoDialog} from "../../widgets/dialogs/YesNoDialog";
import {RadioButtonDialog} from "../../widgets/dialogs/RadioButtonDialog";
import {ERROR_TYPES} from "../../../config/errorTypes";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";

class ToiletView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);
        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handleAddReviewButtonPress = this._handleAddReviewButtonPress.bind(this);
        this._handleYourReviewPress = this._handleYourReviewPress.bind(this);
        this._handleFinishReview = this._handleFinishReview.bind(this);
        this._handleDeleteReview = this._handleDeleteReview.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    componentDidMount() {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        this.refreshToilet();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    _handleDeleteReview() {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        if (!this.props.toilet.userRating)
            return true;
        ToiletEndpoints.deleteUserReview(this.props.toilet.userRating._id)
            .then(() => {
                this.refreshToilet();
            });
    }

    // function called by child when getting back
    _handleFinishReview(userRating) {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        ToiletEndpoints.rateToilet(this.props.toilet._id, userRating)
            .then(() => {
                this.refreshToilet();
            });
    }

    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handleAddReviewButtonPress() {
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_STEP_ONE, {
            userRating: this.props.toilet.userRating,
            title: this.props.toilet.userRating ? 'Modifier votre avis' : 'Donner votre avis',
            placeName: this.props.toilet.placeName,
            onFinishRating: this._handleFinishReview
        });
    }

    _handleYourReviewPress() {
        if (!this.props.toilet.userRating) {
            return true;
        }
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_DETAILS,
            {
                userRating: this.props.toilet.userRating,
                transition: TRANSITIONS.FROM_BOTTOM,
                _handleAddReviewButtonPress: this._handleAddReviewButtonPress,
                onDeleteReview: this._handleDeleteReview
            });
    }

    // DISPATCH ACTIONS
    refreshToilet() {
        ToiletEndpoints.getToilet(this.props.navigation.getParam('placeId'))
            .then((toilet) => {
                this.props.dispatch({type: ACTIONS_TOILET.SET_TOILET, value: toilet});
                this.props.dispatch({type: ACTIONS_TOILET.STOP_LOADING});
            })
            .catch((err) => {
                if (err.errorType === ERROR_TYPES.NOT_LOGGED) {
                    this.backToLoginView();
                }
            });
    }

    // RENDERING COMPONENTS
    renderRating() {
        const rating = this.props.toilet.rating || {};
        return <GlobalRating rating={rating}
                             ratingCount={this.props.toilet.ratingCount}></GlobalRating>

    }

    renderPlaceType() {
        let iconName;
        switch (this.props.toilet.placeType) {
            case PLACE_TYPES.RESTAURANT:
                iconName = 'restaurant';
                break;
            case PLACE_TYPES.BAR:
                iconName = 'local-bar';
                break;
            case PLACE_TYPES.CINEMA:
                iconName = 'local-movies';
                break;
            case PLACE_TYPES.HOTEL:
                iconName = 'hotel';
                break;
            default:
                return;
        }
        return (
            <View style={GlobalStyles.iconWithTextBlock}>
                <Icon reverse name={iconName}
                      color={STYLE_VAR.backgroundDefault}
                      size={20}/>
                <Text style={[GlobalStyles.secondaryText]}>
                    {this.props.toilet.placeType}
                </Text>
            </View>
        );
    }

    renderAccessibleDetail() {
        let accessible = this.props.toilet.isAccessible;
        if (accessible == null) {
            return;
        }
        accessible = {
            text: accessible ? 'Accès\nhandicappé' : 'Aucun accès\nhandicappé',
            color: accessible ? STYLE_VAR.backgroundDefault : STYLE_VAR.backgroundLightGray
        };


        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon reverse
                  name="accessible"
                  color={accessible.color}
                  size={20}/>
            <Text style={[GlobalStyles.secondaryText, {textAlign: 'center'}]}>
                {accessible.text}
            </Text>
        </View>
    }

    renderMixedDetail() {
        let mixed = this.props.toilet.isMixed;
        if (mixed == null) {
            return;
        }
        mixed = {
            text: mixed ? 'Toilettes\nmixtes' : "Toilettes\nnon mixtes",
            color: mixed ? STYLE_VAR.backgroundDefault : STYLE_VAR.backgroundLightGray
        };


        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon name="human-male-female"
                  reverse
                  type="material-community"
                  color={mixed.color}
                  size={20}/>
            <Text style={[GlobalStyles.secondaryText, {textAlign: 'center'}]}>
                {mixed.text}
            </Text>
        </View>
    }

    renderToiletDetails() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                <ScrollView style={GlobalStyles.stackContainer}>
                    <View style={GlobalStyles.sectionContainer}>
                        <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                            {this.renderPlaceType()}
                            {this.renderAccessibleDetail()}
                            {this.renderMixedDetail()}
                        </View>
                    </View>
                    <View style={[GlobalStyles.sectionContainer, {borderBottomWidth: 0}]}>
                        {this.renderRating(this.props.toilet)}
                    </View>
                </ScrollView>
                {this.renderFooter()}
            </View>
        );
    }

    renderLoading() {
        return (
            <ActivityIndicator size="large"/>
        )
    }

    renderNoToilets() {
        return (
            <Text>Pas de toilettes</Text>
        )
    }

    renderFooter() {
        let buttonLabel = "Donner votre avis";
        let userRating;
        if (this.props.toilet.userRating) {
            buttonLabel = "Modifier votre avis";
            userRating =
                <View styles={[GlobalStyles.flexColumnCenter]}>
                    <Text style={GlobalStyles.secondaryText}>Votre avis</Text>
                    <ToiletRating size={15} rating={this.props.toilet.userRating.rating.global} readonly={true}
                                  containerStyle={{paddingTop: 0, paddingBottom: 2}}></ToiletRating>
                    <Text style={[GlobalStyles.secondaryText, {
                        fontFamily: STYLE_VAR.text.bold,
                        fontSize: STYLE_VAR.text.size.smaller
                    }]}>Détails</Text>
                </View>
        }

        return <TouchableNativeFeedback onPress={this._handleYourReviewPress}>
            <View style={GlobalStyles.footerContainer}>
                <Button title={buttonLabel}
                        onPress={() => this._handleAddReviewButtonPress()}
                        buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                            // marginBottom: 15
                        }]}
                        titleStyle={GlobalStyles.defaultFont}
                ></Button>
                {userRating}
            </View>
        </TouchableNativeFeedback>
    }


    render() {
        let body;
        let containerStyle = {flex: 1};
        if (!this.props.isReady) {
            body = this.renderLoading();
            containerStyle = GlobalStyles.loading;
        }
        else if (!this.props.toilet) {
            body = this.renderNoToilets();
            containerStyle = styles.backgroundStyle
        }
        else {
            body = this.renderToiletDetails();
        }
        return <View style={containerStyle}>
            {body}
        </View>;
    }
}

function mapStateToProps(state) {
    return {
        toilet: state.toiletReducer.toilet,
        isReady: state.toiletReducer.isReady
    };
}


const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: 'white',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
        width: '100%'
    }
});

export default connect(mapStateToProps)(ToiletView);