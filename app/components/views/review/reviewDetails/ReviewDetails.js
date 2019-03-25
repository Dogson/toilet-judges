// LIBRAIRIES
import React from 'react';
import {
    Text,
    View,
    Alert,
    StyleSheet,
} from 'react-native';
import {Icon} from 'react-native-elements';

// CONST
import {STYLE_VAR} from "../../../../styles/stylingVar";
import {GlobalStyles} from '../../../../styles/styles'

// API ENDPOINTS

//COMPONENTS
import {GlobalRating} from "../../../widgets/rating/GlobalRating";

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
        this.state._handleAddReviewButtonPress(this.state.userRating);
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
        this.props.navigation.getParam('onDeleteReview')(this.state.userRating);
    }

    renderText() {
        return <View style={[GlobalStyles.sectionContainer, {borderBottomWidth: 0}]}>
            <Text style={GlobalStyles.reviewText}>« {this.state.userRating.text} »</Text>
        </View>;
    }

    render() {
        return <View style={styles.backgroundStyle}>
            <View style={{paddingHorizontal: 15}}>
                <View>
                    <Text style={GlobalStyles.titleText}>
                        Votre avis
                    </Text>
                </View>
                <View>
                    <Text style={GlobalStyles.primaryText}>{this.props.navigation.getParam('placeName')}</Text>
                </View>
                <View style={[GlobalStyles.sectionContainer, {borderBottomWidth: this.state.userRating.text && this.state.userRating.text.length > 0 ? StyleSheet.hairlineWidth : 0}]}>
                    <GlobalRating rating={this.state.userRating.rating}/>
                </View>
                {this.state.userRating.text && this.state.userRating.text.length > 0 ? this.renderText() : null}
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

