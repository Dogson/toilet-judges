import React from 'react';
import {Rating} from 'react-native-ratings';
import {View, Image} from 'react-native';

import {APP_CONFIG} from "../../config/appConfig";

const TOILET_IMAGE = require('../../../assets/img/toiletRating.png');

export class ToiletRating extends React.Component {
    render() {
        const ratingBackgroundColor = this.props.rating ? 'white' : '#c8c7c8';
        return (
            <View>
                <Rating
                    type='custom'
                    ratingImage={TOILET_IMAGE}
                    ratingColor={APP_CONFIG.styling.ratingColor}
                    ratingBackgroundColor={ratingBackgroundColor}
                    ratingCount={5}
                    imageSize={20}
                    onFinishRating={this.props.ratingCompleted}
                    style={{paddingVertical: 10}}
                    startingValue={this.props.rating || 0}
                    readonly={this.props.readonly}
                />
            </View>);
    }
}
