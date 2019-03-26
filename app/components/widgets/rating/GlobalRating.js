import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ToiletRating} from "./ToiletRating"
import {GlobalStyles} from "../../../styles/styles"

import {STYLE_VAR} from "../../../styles/stylingVar";

export class GlobalRating extends React.Component {

    renderGlobalRating() {
        if (this.props.noGlobalScore) {
            return;
        }
        let ratingCountText = "";
        if (this.props.ratingCount) {
            ratingCountText = this.props.ratingCount + " avis";
        }
        else if (this.props.ratingCount === 0){
            ratingCountText = "Aucun avis n'a encore été donné";
        }
        return <View style={styles.block}>
            {this.renderGlobalRatingText()}
            <View style={GlobalStyles.flexRow}>
                <ToiletRating size={30} rating={this.props.rating.global} readonly={true}></ToiletRating>
            </View>
            <View style={GlobalStyles.flexRow}>
                <Text style={GlobalStyles.secondaryText}>{ratingCountText}</Text>
            </View>
        </View>;
    }

    renderGlobalRatingText() {
        if (this.props.rating.global) {
            return <View style={GlobalStyles.flexRow}>
                <Text style={styles.ratingText}>{this.props.rating.global.toFixed(1)}</Text>
            </View>;
        }
    }

    renderDetailedRating() {
        if (this.props.rating.global) {
            const ratingSize = this.props.noGlobalScore ? 15 : 20;
            const textStyle = this.props.noGlobalScore ? GlobalStyles.secondaryText : GlobalStyles.primaryText;
            return <View style={styles.block}>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[textStyle, {marginTop: 5}]}>Propreté</Text>
                    <ToiletRating rating={this.props.rating.cleanliness} size={ratingSize} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[textStyle, {marginTop: 5}]}>Équipements</Text>
                    <ToiletRating rating={this.props.rating.functionality} size={ratingSize} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[textStyle, {marginTop: 5}]}>Ambiance</Text>
                    <ToiletRating rating={this.props.rating.decoration} size={ratingSize} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[textStyle, {marginTop: 5}]}>Qualité/Prix</Text>
                    <ToiletRating rating={this.props.rating.value} size={ratingSize} readonly={true}></ToiletRating>
                </View>
            </View>;
        }
    }

    render() {
        return (
            <View style={{flexDirection: 'column', justifyContent: "space-around"}}>
                {this.renderGlobalRating()}
                {this.renderDetailedRating()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ratingText: {
        color: STYLE_VAR.ratingColor,
        fontSize: STYLE_VAR.text.size.bigger
    },
    block: {
        flexDirection: "column",
        paddingTop: 10,
        paddingBottom: 10
    }
});
