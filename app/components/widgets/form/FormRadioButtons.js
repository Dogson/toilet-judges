import {Text, TouchableNativeFeedback, View} from "react-native";
import {RadioButton} from "react-native-paper";
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";
import RadioGroup from '../../lib/RadioButtonGroup';
import * as React from "react";

export class FormRadioButtons extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: props.options.map((option) => {
                option.selected = this.props.checked === option.value;
                return option;
            })
        };

        this._handlePressRadioButton = this._handlePressRadioButton.bind(this);
    }

    componentWillReceiveProps(props) {
        let options = props.options.map((option) => {
            option.selected = this.props.checked === option.value;
            return option;
        });
        this.setState({options});
    }

    _handlePressRadioButton(options) {
        let option = options.find((option) => {
            return option.selected;
        });
        this.props.onPress(option.value);
    }

    render() {
        return (
            <RadioGroup
                onPress={this._handlePressRadioButton}
                radioButtons={this.state.options}
                flexDirection={this.props.flexDirection}
            />
        )
    }

}