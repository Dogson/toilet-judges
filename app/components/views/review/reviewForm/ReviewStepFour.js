// LIBRAIRIES
import React from 'react';
import {
    Text,
    ScrollView,
    View,
    StyleSheet, TextInput,
} from 'react-native';
import {Button} from 'react-native-elements';

// CONST
import {GlobalStyles} from '../../../../styles/styles'
import {ROUTE_NAMES} from "../../../../config/navigationConfig";

// API ENDPOINTS

//COMPONENTS
import {ToiletRating} from "../../../widgets/rating/ToiletRating";
import {STYLE_VAR} from "../../../../styles/stylingVar";
import KeyboardSpacer from "react-native-keyboard-spacer";


class ReviewStepFour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userRating: this.props.navigation.getParam('userRating'),
            text: '',
            footerBottom: 0
        };

        this._handleBackButtonClick = this._handleBackButtonClick.bind(this);
        this._handlePressSubmit = this._handlePressSubmit.bind(this);
        this._handleChangeText = this._handleChangeText.bind(this);
        this._handleKeyboardOpen = this._handleKeyboardOpen.bind(this);
    }


    // HANDLING EVENTS
    _handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    _handlePressSubmit() {
        if (this.props.navigation.getParam('callBackFn')) {
            this.props.navigation.getParam('callBackFn')(this.state.userRating);
        }
        this.props.navigation.navigate(this.props.navigation.getParam('originRoute'));
        this.props.navigation.getParam('onFinishRating')(this.state.userRating);
    }

    _handleChangeText(text) {
        this.setState(prevState => ({
            userRating: {
                ...prevState.userRating,
                text: text
            }
        }))
    }

    _handleKeyboardOpen(isOpened, height) {
        const bottomHeight = isOpened ? height : 0;
        this.setState({footerBottom: bottomHeight});
    }

    //RENDER COMPONENTS
    renderFooter() {
        return (
            <View style={[GlobalStyles.footerContainer, {bottom: this.state.footerBottom}]}>
                <Button
                    title="Valider"
                    onPress={() => this._handlePressSubmit()}
                    buttonStyle={[GlobalStyles.primaryButton, GlobalStyles.tallButton, {
                        paddingHorizontal: 10
                    }]}
                    titleStyle={GlobalStyles.defaultFont}/>
            </View>
        )
    }

    renderRemainingCharacters() {
        const nbWritten = this.state.userRating.text ? this.state.userRating.text.length : 0;
        const nbRemaining = 200 - nbWritten;
        const text = nbRemaining > 1 ? 'caractères restants' : 'caractère restant';

        return <View style={{alignSelf: 'flex-end', marginBottom: 5}}>
            <Text
                style={[GlobalStyles.secondaryText,
                    {color: nbRemaining > 0 ? STYLE_VAR.text.color.secondary : 'red'}]}>
                {nbRemaining} {text}
            </Text>
        </View>
    }

    renderBody() {
        return <ScrollView style={{flex: .8, marginBottom: 70}}>
            <View style={{paddingHorizontal: 15, justifyContent: 'flex-start'}}>
                <Text style={[GlobalStyles.secondaryText, styles.stepNumber]}>Étape 4/4</Text>
                <View style={styles.titleContainer}>
                    <Text style={GlobalStyles.titleText}>
                        Votre experience en quelques mots
                    </Text>
                </View>
                {this.renderRemainingCharacters()}
                <View style={{flexGrow: 1}}>
                    <TextInput
                        multiline={true}
                        onChangeText={this._handleChangeText}
                        value={this.state.userRating.text}
                        maxLength={200}
                        numberOfLines={8}
                        style={[GlobalStyles.primaryText, {textAlignVertical: 'top'}]}
                        underlineColorAndroid="transparent"
                        placeholder="Écrivez votre texte ici."
                    />
                </View>
            </View>
        </ScrollView>
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>
                {this.renderBody()}
                {this.renderFooter()}
                <KeyboardSpacer onToggle={this._handleKeyboardOpen}/>
            </View>)
    }
}

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: 15,
        paddingBottom: 20,
        paddingRight: 40
    },
    stepNumber: {
        paddingTop: 15
    },
    rating: {
        paddingHorizontal: 30
    },
    ratingSection: {
        paddingBottom: 15
    }
});

export default ReviewStepFour;