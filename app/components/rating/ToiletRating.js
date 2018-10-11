import React from 'react';
import {Rating} from 'react-native-ratings';
import {View, Image} from 'react-native';

const TOILET_IMAGE = require('../../../assets/img/toiletRating.png');

export class ToiletRating extends React.Component {
    render() {
        return (
            <View>
                <Image
                    style={{width: 50, height: 50}}
                    source={TOILET_IMAGE}
                />
                <Rating
                    type='custom'
                    ratingImage={TOILET_IMAGE}
                    ratingColor='#3498db'
                    ratingBackgroundColor='#c8c7c8'
                    ratingCount={5}
                    imageSize={30}
                    onFinishRating={this.ratingCompleted}
                    style={{paddingVertical: 10}}
                />
            </View>);
    }
}
