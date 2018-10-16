'use strict';

import {StyleSheet} from 'react-native';
import {APP_CONFIG} from "../config/appConfig";

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
        fontSize: APP_CONFIG.styling.text.size.big,
        color: APP_CONFIG.styling.text.color.primary
    },
    primaryText: {
        fontSize: APP_CONFIG.styling.text.size.normal,
        color: APP_CONFIG.styling.text.color.primary,
    },
    secondaryText: {
        fontSize: APP_CONFIG.styling.text.size.small,
        color: APP_CONFIG.styling.text.color.secondary
    }
});