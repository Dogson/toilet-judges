// LIBRAIRIES
import cloneDeep from 'lodash/cloneDeep';
import moment from "moment";
import 'moment/locale/fr';
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
import connect from "react-redux/es/connect/connect";

// CONST
import {GlobalStyles} from "../../../styles/styles";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";
import {TOILET_REVIEWS_SORT_OPTIONS} from "../../../config/const";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {ACTIONS_TOILET} from "./ToiletActions";

// API ENDPOINTS
import {RatingEndpoints} from "../../../endpoints/ratingEndpoints";
import {ToiletEndpoints} from "../../../endpoints/toiletEndpoints";

//COMPONENTS
import {ToiletRating} from "../../widgets/rating/ToiletRating";
import {SortDropdown} from "../../widgets/dropdown/SortDropdown";


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
        this._handleSelectSortOption = this._handleSelectSortOption.bind(this);

        moment.locale('fr');
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButtonClick);
    }

    componentDidMount() {
        this.props.dispatch({type: ACTIONS_TOILET.SET_SORT_OPTION, value: 0});
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
                    this.refreshToilet();
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
                        this.refreshToilet();
                    }
                });
        }
        else {
            RatingEndpoints.createUserReview(id, userRating)
                .then(() => {
                    ToastAndroid.show("Votre avis a été enregistré.", ToastAndroid.LONG);
                    if (this.mounted) {
                        this.refreshList();
                        this.refreshToilet();
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

    _handleSelectSortOption(selectedOption) {
        this.props.dispatch({type: ACTIONS_TOILET.SET_SORT_OPTION, value: selectedOption});
    }

    // DISPATCH ACTIONS
    refreshList() {
        this.props.dispatch({type: ACTIONS_TOILET.START_LOADING});
        ToiletEndpoints.getToiletReviews(this.props.navigation.dangerouslyGetParent().getParam('place').id)
            .then((reviews) => {
                if (this.mounted) {
                    this.props.dispatch({
                        type: ACTIONS_TOILET.SET_REVIEWS,
                        value: reviews
                    });
                    this.props.dispatch({type: ACTIONS_TOILET.STOP_LOADING});
                }
            })
    }

    // DISPATCH ACTIONS
    refreshToilet() {
        let place = this.props.navigation.dangerouslyGetParent().getParam('place');
        ToiletEndpoints.getToilet(place.id)
            .then((toilet) => {
                this.props.dispatch({type: ACTIONS_TOILET.SET_TOILET, value: toilet});
                this.props.dispatch({type: ACTIONS_TOILET.STOP_LOADING});
            });
    }

    // RENDERING COMPONENTS
    renderRow({item, index}) {
        return <View style={{paddingHorizontal: 15}}>
            <View style={[GlobalStyles.flexColumn, {
                justifyContent: 'center',
                paddingVertical: 25,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: "#c8c7cc"
            }]}>
                {index === 0 && this.renderFilter()}
                <View style={[GlobalStyles.flexRowSpaceBetween, {alignItems: 'center'}]}>
                    <View>
                        <Text
                            style={[GlobalStyles.primaryText]}>{item.user.username}</Text>
                        <Text
                            style={GlobalStyles.secondaryText}>{item.date < 999999999999999999999 ? moment(item.date).calendar().split(" à")[0] : 'Il y a très longtemps'}</Text>
                    </View>
                    <ToiletRating readonly rating={item.rating.global}/>
                </View>
                <View style={{marginTop: 10}}>
                    <Text
                        style={[GlobalStyles.reviewText, {fontSize: STYLE_VAR.text.size.small}]}>{item.text}</Text>
                </View>
            </View>
        </View>
    }

    renderReviewList() {
        return <View style={{flexGrow: 1}}>
            <View style={{flexGrow: 1, marginBottom: 70}}>
                <FlatList
                    data={this.props.reviews}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.uid}
                    ListEmptyComponent={this.renderEmptyList()}
                    contentContainerStyle={[{flexGrow: 1}, this.props.reviews && this.props.reviews.length ? null : {justifyContent: 'center'}]}
                />
            </View>
            {this.renderFooter()}
        </View>

    }

    renderFilter() {
        return <View style={{alignSelf: 'flex-end', paddingBottom: 15}}>
            <SortDropdown options={TOILET_REVIEWS_SORT_OPTIONS} selected={this.props.sortOption}
                          onSelect={this._handleSelectSortOption}/>
        </View>;

    }

    renderEmptyList() {
        return <View style={{
            flexGrow: 1,
            paddingHorizontal: 20,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={{paddingVertical: 15}}>
                <Text style={GlobalStyles.primaryText}>Soyez le premier a donner votre avis !</Text>
            </View>
            <Button title="Donner votre avis"
                    buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {paddingHorizontal: 10}]}
                    titleStyle={GlobalStyles.defaultFont}
                    onPress={this._handleAddReviewButtonPress}/>
        </View>
    }


    renderLoading() {
        return <ActivityIndicator style={{alignSelf: 'center', flex: 1}} size="large"/>;
    }

    renderFooter() {
        if (!this.props.reviews || this.props.reviews.length === 0)
            return;
        let buttonLabel = "Donner votre avis";
        let userRating;
        if (this.props.toilet && this.props.toilet.userRating) {
            buttonLabel = "Modifier votre avis";
            userRating =
                <View styles={[GlobalStyles.flexColumnCenter]}>
                    <Text style={GlobalStyles.secondaryText}>Votre avis</Text>
                    <ToiletRating size={15} rating={this.props.toilet.userRating.rating.global} readonly={true}
                                  containerStyle={{paddingTop: 0, paddingBottom: 2}}/>
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
                        buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton]}
                        titleStyle={GlobalStyles.defaultFont}
                        disabled={!this.props.isReady}
                />
                {userRating}
            </View>
        </TouchableNativeFeedback>
    }

    renderBody() {
        if (!this.props.isReady) {
            return this.renderLoading();
        }
        return this.renderReviewList();
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
        reviews: state.toiletReducer.reviews,
        sortOption: state.toiletReducer.sortOption
    };
}

export default connect(mapStateToProps)(ToiletReviewsView);