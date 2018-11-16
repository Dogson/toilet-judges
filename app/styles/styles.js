'use strict';import {StyleSheet} from 'react-native';import {STYLE_VAR} from "./stylingVar";export const GlobalStyles = StyleSheet.create({    container: {        backgroundColor: 'white',        margin: 10,        borderRadius: 5    },    stackContainer: {        backgroundColor: 'white',        margin: 0    },    sectionContainer: {        borderBottomColor: '#E8E8E8',        borderBottomWidth: 1,        padding: 20    },    withMarginContainer: {        marginLeft: 50,        marginRight: 50    },    flexRow: {        flexDirection: 'row',        justifyContent: 'center'    },    flexRowSpaceBetween: {        flexDirection: 'row',        justifyContent: 'space-between'    },    flexColumn: {        flexDirection: 'column',        justifyContent: 'center'    },    flexColumnCenter: {        flexDirection: 'column',        justifyContent: 'center',        alignItems: 'center'    },    titleText: {        fontSize: STYLE_VAR.text.size.big,        color: STYLE_VAR.text.color.primary    },    primaryText: {        fontSize: STYLE_VAR.text.size.normal,        color: STYLE_VAR.text.color.primary,    },    secondaryText: {        fontSize: STYLE_VAR.text.size.small,        color: STYLE_VAR.text.color.secondary    },    pressableText: {        color: STYLE_VAR.backgroundDefault,        textDecorationLine: 'underline'    },    loading: {        position: 'absolute',        left: 0,        right: 0,        top: 0,        bottom: 0,        paddingBottom: 20,        opacity: 0.8,        backgroundColor: 'white',        justifyContent: 'center',        alignItems: 'center'    },    primaryButton: {        backgroundColor: STYLE_VAR.backgroundDefault    },    secondaryButton : {        backgroundColor: STYLE_VAR.backgroundSecondary,        borderColor: STYLE_VAR.text.color.secondary,        borderWidth: 1    },    secondaryButtonTitle: {        color: STYLE_VAR.text.color.secondary    },    inputStyleFocus: {        borderColor: STYLE_VAR.backgroundDefault,    },    inputStyleError: {        borderColor: "red"    },    inputContainerStyle: {        width: '100%',        marginTop: 10,        marginBottom: 10    },    logoText: {        fontFamily: "garment-district",        fontSize: 40,        color: STYLE_VAR.text.color.secondary    }});