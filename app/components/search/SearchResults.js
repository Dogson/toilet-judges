// LIBRAIRIES
import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableNativeFeedback, Alert} from "react-native";

// STYLES
import globalStyles from '../../styles/styles'

class SearchResults extends React.Component {
    mapToiletListWithKey() {
        return this.props.toiletsList.map((toilet) => {
            return {...toilet, key: toilet._id}
        })
    }

    renderEmptyList() {
    return <Text style={{fontStyle:"italic", textAlign: 'center'}}>Aucune toilette ne correspond à la recherche.</Text>
    }

    render() {
        return <View style={[globalStyles.container, styles.container]}>
            <FlatList
                data={this.mapToiletListWithKey()}
                keyboardShouldPersistTaps='always'
                renderItem={({item}) =>
                    <TouchableNativeFeedback onPress={() => this.props.handlePressToilet(item)}
                                             background={TouchableNativeFeedback.SelectableBackground()}>
                        <View>
                            <Text style={styles.item}>
                                {item.placeName || "empty"}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>}
                ListEmptyComponent={this.renderEmptyList()}
                showsVerticalScrollIndicator={false}
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
        fontSize: 18,
        height: 44,
    },
});

export default SearchResults;