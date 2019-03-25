// LIBRAIRIES
import React from 'react';
import {
    Text,
    FlatList,
    View,
    StyleSheet,
    TouchableNativeFeedback,
    ActivityIndicator,
    ToastAndroid
} from 'react-native';

// CONST
import {GlobalStyles} from "../../../../styles/styles";
import {ROUTE_NAMES, TRANSITIONS} from "../../../../config/navigationConfig";

// API ENDPOINTS
import {RatingEndpoints} from "../../../../endpoints/ratingEndpoints";

//COMPONENTS
import {ToiletRating} from "../../../widgets/rating/ToiletRating";


export class UserReviewsView extends React.Component {
    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            reviews: []
        };

        this.renderRow = this.renderRow.bind(this);
        this._handlePressUserReview = this._handlePressUserReview.bind(this);
        this._handleAddReviewButtonPress = this._handleAddReviewButtonPress.bind(this);
        this._handleDeleteReview = this._handleDeleteReview.bind(this);
        this._handleFinishReview = this._handleFinishReview.bind(this);

    }

    componentDidMount() {
        this.refreshList();
    }

    // HANDLING EVENTS
    _handlePressUserReview(userReview) {
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_DETAILS,
            {
                placeName: userReview.toilet.name,
                userRating: userReview,
                transition: TRANSITIONS.FROM_BOTTOM,
                _handleAddReviewButtonPress: this._handleAddReviewButtonPress,
                onDeleteReview: this._handleDeleteReview
            });
    }

    _handleAddReviewButtonPress(userReview, callBackFn) {
        this.props.navigation.navigate(ROUTE_NAMES.REVIEW_STEP_ONE, {
            userRating : userReview,
            title: 'Modifier votre avis',
            placeName: userReview.toilet.name,
            onFinishRating: this._handleFinishReview,
            originRoute: ROUTE_NAMES.REVIEW_DETAILS,
            callBackFn: callBackFn
        });
    }

    _handleDeleteReview(userReview) {
       this.setState({isLoading: true});
        RatingEndpoints.deleteUserReview(userReview.toiletId, userReview.uid)
            .then(() => {
                this.refreshList();
                ToastAndroid.show("Votre avis a été supprimé.", ToastAndroid.LONG);
            });
    }

    _handleFinishReview(userRating) {
        let toiletId = userRating.toiletId;
        this.setState({isLoading: true});
            RatingEndpoints.updateUserReview(toiletId, userRating)
                .then(() => {
                    this.refreshList();
                    ToastAndroid.show("Votre avis a été modifié.", ToastAndroid.LONG);
                });
    }

    // DISPATCH ACTIONS
    refreshList() {
        this.setState({isLoading: true});
        RatingEndpoints.getCurrentUserReviews()
            .then((reviews) => {
                this.setState({
                    reviews: reviews,
                    isLoading: false
                });
            })
    }

    // RENDERING COMPONENTS
    renderRow({item}) {
        return <TouchableNativeFeedback
            onPress={() => this._handlePressUserReview(item)}>
            <View style={[GlobalStyles.flexColumn, {
                justifyContent: 'center',
                paddingHorizontal: 15,
                paddingBottom: 10,
                paddingTop: 2,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: "#c8c7cc"
            }]}>
                <View style={[GlobalStyles.flexRowSpaceBetween, {flex: 1}]}>
                    <Text
                        style={[GlobalStyles.primaryText, {alignSelf: 'center', flex: 0.7}]}
                        numberOfLines={1}>
                        {item.toilet.name}
                    </Text>
                    <View style={{flex: 0.3}}>
                        <ToiletRating readonly rating={item.rating.global}/>
                    </View>
                </View>
                <View>
                    <Text
                        style={[GlobalStyles.secondaryText]}
                        numberOfLines={1}>
                        {item.toilet.address}
                    </Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    }

    renderReviewList() {
        return <FlatList
            data={this.state.reviews}
            renderItem={this.renderRow}
            keyExtractor={(item) => item.uid}
        />
    }


    renderLoading() {
        return <ActivityIndicator style={{alignSelf: 'center', flex: 1}} size="large"/>;
    }

    renderBody() {
        if (this.state.isLoading) {
            return this.renderLoading();
        }
        else {
            return this.renderReviewList();
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