import React from 'react';
import Rating from 'react-native-star-rating';
import {View} from 'react-native';

import {STYLE_VAR} from "../../../styles/stylingVar";

export class ToiletRating extends React.Component {
    render() {
        let containerStyle = this.props.containerStyle || {paddingVertical: 10};
        return (
            <View>
                <Rating
                    activeOpacity={0.7}
                    emptyStar="star-o"
                    fullStarColor={this.props.ratingColor || STYLE_VAR.ratingColor}
                    maxStars={5}
                    starSize={this.props.size || 20}
                    selectedStar={(value) => this.props.onFinishRating(value)}
                    containerStyle={containerStyle}
                    rating={this.props.rating || 0}
                    disabled={this.props.readonly}
                />
            </View>);
    }
}
