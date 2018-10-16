'use strict';

import {StyleSheet} from 'react-native';
import {STYLE_VAR} from "../config/stylingVar";

export const GlobalStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 5
    },
    stackContainer: {
        backgroundColor: 'white',
        margin: 0
    },
    sectionContainer: {
        borderBottomColor: '#E8E8E8',
        borderBottomWidth: 1,
        padding: 20
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    flexColumn: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: STYLE_VAR.text.size.big,
        color: STYLE_VAR.text.color.primary
    },
    primaryText: {
        fontSize: STYLE_VAR.text.size.normal,
        color: STYLE_VAR.text.color.primary,
    },
    secondaryText: {
        fontSize: STYLE_VAR.text.size.small,
        color: STYLE_VAR.text.color.secondary
    },
    pressableText: {
        color: STYLE_VAR.backgroundDefault,
        textDecorationLine: 'underline'
    }
});