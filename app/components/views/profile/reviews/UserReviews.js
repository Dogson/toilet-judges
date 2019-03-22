// LIBRAIRIES
import React from 'react';
import {
    BackHandler,
    Text,
    ScrollView,
    FlatList,
    View,
    StyleSheet,
    TouchableNativeFeedback,
    ActivityIndicator
} from 'react-native';
import {connect} from "react-redux";
import {Icon, Button} from 'react-native-elements';
import {ToiletEndpoints} from "../../../../endpoints/toiletEndpoints";
import {RatingEndpoints} from "../../../../endpoints/ratingEndpoints";
import {ACTIONS_TOILET} from "../../toilet/ToiletActions";
import {GlobalStyles} from "../../../../styles/styles";
import {ToiletRating} from "../../../widgets/rating/ToiletRating";
import {STYLE_VAR} from "../../../../styles/stylingVar";

// CONST

// API ENDPOINTS

//COMPONENTS

export class UserReviews extends React.Component {
    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            reviews: []
        }
    }

    componentDidMount() {
        this.refreshList();
    }

    // HANDLING EVENTS


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
            onPress={() => {

            }}>
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
                        <ToiletRating disabled rating={item.rating.global}/>
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
        return <ActivityIndicator style={{alignSelf: 'center'}} size="large"/>;
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