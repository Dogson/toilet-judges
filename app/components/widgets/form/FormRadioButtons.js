import {Text, TouchableNativeFeedback, View} from "react-native";
import {RadioButton} from "react-native-paper";
import {GlobalStyles} from "../../../styles/styles";
import * as React from "react";

export class FormRadioButtons extends React.Component {
    constructor(props) {
        super(props);
        this._handlePressRadioButton = this._handlePressRadioButton.bind(this);
    }

    state = {
        value: this.props.defaultChecked,
    };

    _handlePressRadioButton(value) {
        this.setState({value: value});
        this.props.onPressRadioButton(value);
    }

    renderRadioButtons() {
        let results = [];

        this.props.options.forEach((option) => {
            const radioButton =
                <TouchableNativeFeedback
                    key={option.value}
                    onPress={() => this._handlePressRadioButton(option.value)}>
                    <View style={{flexDirection: 'row'}}>
                        <RadioButton
                            value={option.value}
                            color="#0090ED"
                        />
                        <Text style={[GlobalStyles.primaryText, {marginTop: 6}]}>
                            {option.text}
                        </Text>
                    </View>
                </TouchableNativeFeedback>;
            results.push(radioButton);
        });
        return results;
    }

    render() {
        return (
            <RadioButton.Group
                onValueChange={(value) => {
                    this._handlePressRadioButton(value)
                }}
                value={this.state.value}
            >
                {this.renderRadioButtons()}
            </RadioButton.Group>
        )
    }

}