import React from 'react';
import Rating from 'react-native-star-rating';
import {View, Image} from 'react-native';

import {STYLE_VAR} from "../../../styles/stylingVar";

const TOILET_IMAGE = require('../../../../assets/img/toiletRating.png');

export class ToiletRating extends React.Component {
    render() {
        return (
            <View>
                <Rating
                    activeOpacity={0.7}
                    emptyStar="star-o"
                    fullStarColor={this.props.ratingColor || STYLE_VAR.ratingColor}
                    maxStars={5}
                    starSize={this.props.size || 20}
                    selectedStar={(value) => this.props.onFinishRating(value)}
                    containerStyle={{paddingVertical: 10}}
                    rating={this.props.rating || 0}
                    disabled={this.props.readonly}
                />
            </View>);
    }
}
