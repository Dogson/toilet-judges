import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ToiletRating} from "./ToiletRating"
import {GlobalStyles} from "../../../styles/styles"

import {APP_CONFIG} from "../../../config/appConfig";
import {STYLE_VAR} from "../../../styles/stylingVar";

export class GlobalRating extends React.Component {

    renderGlobalRating() {
        let ratingCountText;
        if (this.props.ratingCount) {
            ratingCountText = this.props.ratingCount + " avis";
        }
        else {
            ratingCountText = "Aucun avis n'a encore été donné";
        }
        return <View style={styles.block}>
            {this.renderGlobalRatingText()}
            <View style={GlobalStyles.flexRow}>
                <ToiletRating rating={this.props.rating.global} readonly={true}></ToiletRating>
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
            return <View style={styles.block}>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Petites attentions</Text>
                    <ToiletRating rating={this.props.rating.attention} size={15} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Propreté</Text>
                    <ToiletRating rating={this.props.rating.cleanliness} size={15} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Décoration</Text>
                    <ToiletRating rating={this.props.rating.decoration} size={15} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Etat de fonctionnement</Text>
                    <ToiletRating rating={this.props.rating.functionality} size={15} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Qualité/Prix</Text>
                    <ToiletRating rating={this.props.rating.value} size={15} readonly={true}></ToiletRating>
                </View>
                <View style={GlobalStyles.flexRowSpaceBetween}>
                    <Text style={[GlobalStyles.primaryText, {marginTop: 5}]}>Effet de surprise</Text>
                    <ToiletRating rating={this.props.rating.wowFactor} size={15} readonly={true}></ToiletRating>
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
