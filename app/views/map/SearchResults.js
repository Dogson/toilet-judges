// LIBRAIRIES
import React from 'react';
import {Text, ScrollView} from "react-native";

class SearchResults extends React.Component {
    render() {
        return <ScrollView>
            <Text>{this.props.searchQuery}</Text>
        </ScrollView>
    }
}

export default SearchResults;