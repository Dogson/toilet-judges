import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ToiletRating} from "./ToiletRating"
import {GlobalStyles} from "../../styles/styles"

import {APP_CONFIG} from "../../config/appConfig";
import {STYLE_VAR} from "../../config/stylingVar";

export class GlobalRating extends React.Component {
    render() {
        let ratingCountText;
        if (this.props.ratingCount) {
            ratingCountText = this.props.ratingCount + " avis";
        }
        else {
            ratingCountText = "Aucun avis n'a encore été donné";
        }
        return (
            <View>
                <View style={GlobalStyles.flexRow}>
                    <Text style={styles.ratingText}>{this.props.rating}</Text>
                </View>
                <View style={GlobalStyles.flexRow}>
                    <ToiletRating rating={this.props.rating} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRow}>
                    <Text style={GlobalStyles.secondaryText}>{ratingCountText}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ratingText: {
        color: STYLE_VAR.ratingColor,
        fontSize: STYLE_VAR.text.size.bigger
    }
});
