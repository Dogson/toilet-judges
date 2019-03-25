// LIBRAIRIES
import React from 'react';
import {
    BackHandler,
    Text,
    ScrollView,
    View,
    StyleSheet,
    TouchableNativeFeedback,
    ActivityIndicator, ToastAndroid
} from 'react-native';
import {connect} from "react-redux";
import {Icon, Button} from 'react-native-elements';

// CONST
import {PLACE_TYPES} from "../../../config/const";
import {ACTIONS_TOILET} from "./ToiletActions";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {GlobalStyles} from '../../../styles/styles'
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";

// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints';
import {RatingEndpoints} from "../../../endpoints/ratingEndpoints";

//COMPONENTS
import {GlobalRating} from "../../widgets/rating/GlobalRating";
import {ToiletRating} from "../../widgets/rating/ToiletRating";

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
        RatingEndpoints.deleteUserReview(this.props.toilet.uid, this.props.toilet.userRating.uid)
            .then(() => {
                ToastAndroid.show("Votre avis a été supprimé.", ToastAndroid.LONG);
                this.refreshToilet();
            });
    }

    // function called by child when getting back
    _handleFinishReview(userRating) {
        let id = this.props.toilet && this.props.toilet.uid ? this.props.toilet.uid : this.props.navigation.getParam('place').id;
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        if (userRating.uid) {
            RatingEndpoints.updateUserReview(id, userRating)
                .then(() => {
                    ToastAndroid.show("Votre avis a été modifié.", ToastAndroid.LONG);
                    this.refreshToilet();
                });
        }
        else {
            RatingEndpoints.createUserReview(id, userRating)
                .then(() => {
                    ToastAndroid.show("Votre avis a été enregistré.", ToastAndroid.LONG);
                    this.refreshToilet();
                });
        }
    }

    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handleAddReviewButtonPress() {
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_STEP_ONE, {
            userRating: this.props.toilet ? this.props.toilet.userRating : null,
            title: this.props.toilet && this.props.toilet.userRating ? 'Modifier votre avis' : 'Donner votre avis',
            placeName: this.props.navigation.getParam('place').name,
            onFinishRating: this._handleFinishReview,
            originRoute: ROUTE_NAMES.TOILET
        });
    }

    _handleYourReviewPress() {
        if (!this.props.toilet || !this.props.toilet.userRating) {
            return true;
        }
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_DETAILS,
            {
                placeName: this.props.navigation.getParam('place').name,
                userRating: this.props.toilet.userRating,
                transition: TRANSITIONS.FROM_BOTTOM,
                _handleAddReviewButtonPress: this._handleAddReviewButtonPress,
                onDeleteReview: this._handleDeleteReview
            });
    }

    // DISPATCH ACTIONS
    refreshToilet() {
        let place = this.props.navigation.getParam('place');
        ToiletEndpoints.getToilet(place.id)
            .then((toilet) => {
                this.props.dispatch({type: ACTIONS_TOILET.SET_TOILET, value: toilet});
                this.props.dispatch({type: ACTIONS_TOILET.STOP_LOADING});
            });
    }

    // RENDERING COMPONENTS
    renderRating() {
        let rating = {};
        let ratingCount = 0;
        if (this.props.toilet && this.props.toilet.rating) {
            rating = this.props.toilet.rating;
            ratingCount = this.props.toilet.ratingCount;
        }
        return <GlobalRating rating={rating}
                             ratingCount={ratingCount}></GlobalRating>

    }

    renderPlaceType() {
        let place = this.props.navigation.getParam('place');
        let placeDetails = PLACE_TYPES.find((placeType) => {
            return placeType.id === place.type;
        });
        if (!placeDetails)
            return null;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5}}>
                <Icon name={placeDetails.icon.name}
                      type={placeDetails.icon.type}
                      color={STYLE_VAR.backgroundDefault}
                      size={15}
                      containerStyle={{paddingRight: 5}}/>
                <Text style={[GlobalStyles.secondaryText, {
                    fontFamily: 'roboto-regular',
                    color: STYLE_VAR.text.color.primary
                }]}>
                    {placeDetails.name}
                </Text>
            </View>
        );
    }

    renderAccessibleDetail() {
        if (!this.props.toilet) {
            return null;
        }
        let accessible = this.props.toilet.isAccessible;
        if (accessible == null) {
            return null;
        }
        accessible = {
            text: accessible ? 'Accès\nhandicappé' : 'Aucun accès\nhandicappé',
            color: accessible ? STYLE_VAR.backgroundDefault : STYLE_VAR.backgroundLightGray,
            textColor: accessible ? STYLE_VAR.text.color.primary : STYLE_VAR.text.color.secondary
        };


        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon reverse
                  name="accessible"
                  color={accessible.color}
                  size={20}/>
            <Text style={[GlobalStyles.secondaryText, {textAlign: 'center', color: accessible.textColor}]}>
                {accessible.text}
            </Text>
        </View>
    }

    renderMixedDetail() {
        if (!this.props.toilet) {
            return null;
        }
        let mixed = this.props.toilet.isMixed;
        if (mixed == null) {
            return;
        }
        mixed = {
            text: mixed ? 'Toilettes\nmixtes' : "Toilettes\nnon mixtes",
            color: mixed ? STYLE_VAR.backgroundDefault : STYLE_VAR.backgroundLightGray,
            textColor: mixed ? STYLE_VAR.text.color.primary : STYLE_VAR.text.color.secondary
        };


        return <View style={GlobalStyles.iconWithTextBlock}>
            <Icon name="human-male-female"
                  reverse
                  type="material-community"
                  color={mixed.color}
                  size={20}/>
            <Text style={[GlobalStyles.secondaryText, {textAlign: 'center', color: mixed.textColor}]}>
                {mixed.text}
            </Text>
        </View>
    }

    renderToiletDetails() {
        return (
            <View style={GlobalStyles.stackContainer}>
                <View style={GlobalStyles.sectionContainer}>
                    {this.renderRating()}
                </View>
                <View style={[GlobalStyles.sectionContainer, {borderBottomWidth: 0}]}>
                    <View style={{flexDirection: 'row', justifyContent: "space-around"}}>
                        {this.renderAccessibleDetail()}
                        {this.renderMixedDetail()}
                    </View>
                </View>
            </View>
        );
    }

    renderLoading() {
        return (
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    renderTitle() {
        return <View style={GlobalStyles.stackContainer}>
            <Text style={GlobalStyles.titleText}>
                {this.props.navigation.getParam('place').name}
            </Text>
            <Text style={GlobalStyles.subtitleText}>
                {this.props.navigation.getParam('place').address}
            </Text>
            {this.renderPlaceType()}
        </View>
    }

    renderFooter() {
        let buttonLabel = "Donner votre avis";
        let userRating;
        if (this.props.toilet && this.props.toilet.userRating) {
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
        if (!this.props.isReady) {
            buttonLabel = "...";
        }
        return <TouchableNativeFeedback onPress={this._handleYourReviewPress}>
            <View style={GlobalStyles.footerContainer}>
                <Button title={buttonLabel}
                        onPress={() => this._handleAddReviewButtonPress()}
                        buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                            // marginBottom: 15
                        }]}
                        titleStyle={GlobalStyles.defaultFont}
                        disabled={!this.props.isReady}
                ></Button>
                {userRating}
            </View>
        </TouchableNativeFeedback>
    }


    render() {
        let body;
        if (!this.props.isReady) {
            body = this.renderLoading();
        }
        else {
            body = this.renderToiletDetails();
        }
        return <View style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}
                        style={{
                            marginBottom: 70,
                            paddingTop: 15
                        }}>
                {this.renderTitle()}
                {body}
            </ScrollView>
            {this.renderFooter()}
        </View>;
    }
}

function mapStateToProps(state) {
    return {
        toilet: state.toiletReducer.toilet,
        isReady: state.toiletReducer.isReady
    };
}

export default connect(mapStateToProps)(ToiletView);