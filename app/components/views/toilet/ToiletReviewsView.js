// LIBRAIRIES
import cloneDeep from 'lodash/cloneDeep';
import React from 'react';
import {
    Text,
    FlatList,
    View,
    StyleSheet,
    TouchableNativeFeedback,
    ActivityIndicator,
    ToastAndroid, BackHandler
} from 'react-native';
import {Button} from 'react-native-elements';

// CONST
import {GlobalStyles} from "../../../styles/styles";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";

// API ENDPOINTS
import {RatingEndpoints} from "../../../endpoints/ratingEndpoints";

//COMPONENTS
import {ToiletRating} from "../../widgets/rating/ToiletRating";
import {ToiletEndpoints} from "../../../endpoints/toiletEndpoints";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {GlobalRating} from "../../widgets/rating/GlobalRating";
import connect from "react-redux/es/connect/connect";
import {ACTIONS_TOILET} from "./ToiletActions";


class ToiletReviewsView extends React.Component {
    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this._handleAddReviewButtonPress = this._handleAddReviewButtonPress.bind(this);
        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handleDeleteReview = this._handleDeleteReview.bind(this);
        this._handleFinishReview = this._handleFinishReview.bind(this);
        this._handleYourReviewPress = this._handleYourReviewPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    componentDidMount() {
        this.mounted = true;
        this.refreshList();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // HANDLING EVENTS
    _handleDeleteReview() {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        if (!this.props.toilet.userRating)
            return true;
        RatingEndpoints.deleteUserReview(this.props.toilet.uid, this.props.toilet.userRating.uid)
            .then(() => {
                ToastAndroid.show("Votre avis a été supprimé.", ToastAndroid.LONG);
                if (this.mounted) {
                    this.refreshList();
                }
            });
    }

    // function called by child when getting back
    _handleFinishReview(userRating) {
        let id = this.props.toilet && this.props.toilet.uid ? this.props.toilet.uid : this.props.navigation.dangerouslyGetParent().getParam('place').id;
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        if (userRating.uid) {
            RatingEndpoints.updateUserReview(id, userRating)
                .then(() => {
                    ToastAndroid.show("Votre avis a été modifié.", ToastAndroid.LONG);
                    if (this.mounted) {
                        this.refreshList();
                    }
                });
        }
        else {
            RatingEndpoints.createUserReview(id, userRating)
                .then(() => {
                    ToastAndroid.show("Votre avis a été enregistré.", ToastAndroid.LONG);
                    if (this.mounted) {
                        this.refreshList();
                    }
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
            placeName: this.props.navigation.dangerouslyGetParent().getParam('place').name,
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
                placeName: this.props.navigation.dangerouslyGetParent().getParam('place').name,
                userRating: this.props.toilet.userRating,
                transition: TRANSITIONS.FROM_BOTTOM,
                _handleAddReviewButtonPress: this._handleAddReviewButtonPress,
                onDeleteReview: this._handleDeleteReview
            });
    }

    _handlePressSeeMore(index) {
        let reviews = cloneDeep(this.props.reviews);
        reviews[index].expanded = !reviews[index].expanded;
        this.props.dispatch({type: ACTIONS_TOILET.SET_REVIEWS, value: reviews});
    }

    // DISPATCH ACTIONS
    refreshList() {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        ToiletEndpoints.getToiletReviews(this.props.navigation.dangerouslyGetParent().getParam('place').id)
            .then((reviews) => {
                if (this.mounted) {
                    this.props.dispatch({type: ACTIONS_TOILET.STOP_LOADING});
                    reviews = reviews.map((review) => {
                        return {...review, expanded: false}
                    });
                    this.props.dispatch({type: ACTIONS_TOILET.SET_REVIEWS, value: reviews});
                }
            })
    }

    // RENDERING COMPONENTS
    renderRow({item, index}) {
        const btnTitle = item.expanded ? "VOIR MOINS" : "VOIR PLUS";
        return <View style={[GlobalStyles.flexColumn, {
            justifyContent: 'center',
            marginHorizontal: 15,
            paddingVertical: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: "#c8c7cc"
        }]}>
            <View style={[GlobalStyles.flexRowSpaceBetween, {alignItems: 'center'}]}>
                <View>
                    <Text
                        style={[GlobalStyles.secondaryText, {color: STYLE_VAR.backgroundDefault}]}>{item.user.username}</Text>
                    <Text style={GlobalStyles.secondaryText}>10/11/2018</Text>
                </View>
                <ToiletRating readonly rating={item.rating.global}/>
            </View>
            {item.expanded ? this.renderExpandedInfos(item) : this.renderCollapsedInfos(item)}
            <View style={{alignSelf: 'center'}}>
                <Button title={btnTitle}
                        onPress={() => {
                            this._handlePressSeeMore(index)
                        }}
                        buttonStyle={GlobalStyles.noBorderButton}
                        titleStyle={GlobalStyles.secondaryButtonTitle}/>
            </View>
        </View>
    }

    renderCollapsedInfos(item) {
        return <View style={{marginTop: 10}}>
            <Text style={GlobalStyles.reviewText}
                  numberOfLines={3}>{item.text}</Text>
        </View>
    }

    renderExpandedInfos(item) {
        return <View style={{marginTop: 10}}>
            <Text style={GlobalStyles.reviewText}>{item.text}</Text>
            <View style={{paddingHorizontal: 40}}>
                <GlobalRating rating={item.rating}
                              noGlobalScore/>
            </View>
        </View>
    }

    renderReviewList() {
        return <View style = {{flexGrow: 1}}>
            <View style={{flexGrow: 1, marginBottom: 70}}>
                <FlatList
                    data={this.props.reviews}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.uid}
                />
            </View>
            {this.renderFooter()}
        </View>

    }

    renderEmptyList() {
        return <View><Text>SOIS LE PREMIER A AJOUTER UNE REVIEW AVEC TOILET JUDGES, L'APPLICATION QUI TE PERMET DE JUGER
            LES TOILETTES (C)</Text></View>
    }


    renderLoading() {
        return <ActivityIndicator style={{alignSelf: 'center', flex: 1}} size="large"/>;
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

    renderBody() {
        if (!this.props.isReady) {
            return this.renderLoading();
        }
        else if (this.props.reviews && this.props.reviews.length > 0) {
            return this.renderReviewList();
        }
        else {
            return this.renderEmptyList();
        }
    }

    render() {
        return <View style={{
            flex: 1,
            backgroundColor: 'white',
        }}>
            {this.renderBody()}
        </View>
    }
}

function mapStateToProps(state) {
    return {
        toilet: state.toiletReducer.toilet,
        isReady: state.toiletReducer.isReady,
        reviews: state.toiletReducer.reviews
    };
}

export default connect(mapStateToProps)(ToiletReviewsView);