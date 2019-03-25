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
import {GlobalStyles} from "../../../styles/styles";
import {ROUTE_NAMES, TRANSITIONS} from "../../../config/navigationConfig";

// API ENDPOINTS
import {RatingEndpoints} from "../../../endpoints/ratingEndpoints";

//COMPONENTS
import {ToiletRating} from "../../widgets/rating/ToiletRating";
import {ToiletEndpoints} from "../../../endpoints/toiletEndpoints";


export class ToiletReviewsView extends React.Component {
    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            reviews: []
        };

        this.renderRow = this.renderRow.bind(this);
        this._handleAddReviewButtonPress = this._handleAddReviewButtonPress.bind(this);
        this._handleDeleteReview = this._handleDeleteReview.bind(this);
        this._handleFinishReview = this._handleFinishReview.bind(this);

    }

    componentDidMount() {
        this.mounted = true;
        this.refreshList();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    // HANDLING EVENTS
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
                ToastAndroid.show("Votre avis a été supprimé.", ToastAndroid.LONG);
                if (this.mounted) {
                    this.refreshList();
                }
            });
    }

    _handleFinishReview(userRating) {
        let toiletId = userRating.toiletId;
        this.setState({isLoading: true});
        RatingEndpoints.updateUserReview(toiletId, userRating)
            .then(() => {
                ToastAndroid.show("Votre avis a été modifié.", ToastAndroid.LONG);
                if (this.mounted) {
                    this.refreshList();
                }
            });
    }

    // DISPATCH ACTIONS
    refreshList() {
        this.setState({isLoading: true});
        ToiletEndpoints.getToiletReviews(this.props.navigation.dangerouslyGetParent().getParam('place').id)
            .then((reviews) => {
                if (this.mounted) {
                    this.setState({
                        reviews: reviews,
                        isLoading: false
                    });
                }
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

    renderEmptyList() {
        return <View><Text>SOIS LE PREMIER A AJOUTER UNE REVIEW AVEC TOILET JUDGES, L'APPLICATION QUI TE PERMET DE JUGER LES TOILETTES (C)</Text></View>
    }


    renderLoading() {
        return <ActivityIndicator style={{alignSelf: 'center', flex: 1}} size="large"/>;
    }

    renderBody() {
        if (this.state.isLoading) {
            return this.renderLoading();
        }
        else if (this.state.reviews && this.state.reviews.length > 0) {
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