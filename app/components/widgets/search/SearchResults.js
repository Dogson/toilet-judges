// LIBRAIRIES
import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableNativeFeedback, Alert} from "react-native";

// STYLES
import {GlobalStyles} from '../../../styles/styles'
import {APP_CONFIG} from "../../../config/appConfig";

export class SearchResults extends React.Component {
    mapToiletListWithKey() {
        return this.props.toiletsList.map((toilet) => {
            return {...toilet, key: toilet._id}
        })
    }

    renderEmptyList() {
        return (
            <Text style={GlobalStyles.secondaryText}>
                Aucune toilette ne correspond à la recherche.
            </Text>
        )
    }

    render() {
        const containerStyle = this.props.toiletsList.length === 0 ? styles.emptyList : null;
        return <View style={[GlobalStyles.container, styles.container]}>
            <FlatList
                data={this.mapToiletListWithKey()}
                keyboardShouldPersistTaps='always'
                renderItem={({item}) =>
                    <TouchableNativeFeedback onPress={() => this.props._handlePressToilet(item)}
                                             background={TouchableNativeFeedback.SelectableBackground()}>
                        <View styles={GlobalStyles.sectionContainer}>
                            <Text style={[styles.item, GlobalStyles.primaryText]}>
                                {item.placeName || "empty"}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>}
                ListEmptyComponent={this.renderEmptyList()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={containerStyle}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 28,
    },
    item: {
        padding: 10,
        height: 44
    },
    emptyList: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});