import {StyleSheet} from "react-native";
import {Input} from "react-native-elements";
import {GlobalStyles} from "../../styles/styles";
import * as React from "react";


export class FormInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputStyle: defaultStyle,
            focus: false
        }
    }

    componentWillReceiveProps(props) {
        if (props.errorMessage) {
            this.setState({inputStyle: GlobalStyles.inputStyleError});
        }
        else {
            if (this.state.focus)
                this.setState({inputStyle: GlobalStyles.inputStyleFocus});
            else
                this.setState({inputStyle: defaultStyle});
        }
    }

    handleOnFocus() {
        this.setState({
            focus: true,
            inputStyle: GlobalStyles.inputStyleFocus
        });
    }

    handleOnBlur() {
        this.setState({
            focus: false,
            inputStyle: defaultStyle
        });
    }

    render() {

        return (
            <Input value={this.props.value}
                   placeholder={this.props.placeholder}
                   containerStyle={GlobalStyles.inputContainerStyle}
                   inputContainerStyle={this.state.inputStyle}
                   onChangeText={this.props.onChangeText}
                   onFocus={() => this.handleOnFocus()}
                   onBlur={() => this.handleOnBlur()}
                   errorStyle={{color: "red"}}
                   errorMessage={this.props.errorMessage}
                   keyboardType={this.props.keyboardType}
                   secureTextEntry={this.props.secureTextEntry}
                   autoCapitalize={this.props.autoCapitalize}>
            </Input>
        )
    }

}

const defaultStyle = StyleSheet.create({});