// LIBRAIRIES
import React from 'react';
import {View, Text, ScrollView, StyleSheet, FlatList, TouchableNativeFeedback, Alert} from "react-native";


class SearchResults extends React.Component {
    mapToiletListWithKey() {
        return this.props.toiletsList.map((toilet) => {
            return {...toilet, key: toilet._id}
        })
    }

    render() {
        return <View style={styles.container}>
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
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

export default SearchResults;