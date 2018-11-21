import * as React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import {Button, Dialog, Portal, RadioButton} from 'react-native-paper';
import {GlobalStyles} from "../../../styles/styles";
import RadioGroup from 'react-native-radio-buttons-group';
import {FormRadioButtons} from "../form/FormRadioButtons";

export class RadioButtonDialog extends React.Component {
    constructor(props) {
        super(props);
        this._handlePressRadioButton = this._handlePressRadioButton.bind(this);
    }

    _handlePressRadioButton(value) {
        this.props.onPressRadioButton(value);
    }

    render() {
        return (
            <View>
                <Portal>
                    <Dialog
                        visible={this.props.visible}
                        onDismiss={this.props.cancel}>
                        <Dialog.Title>{this.props.title}</Dialog.Title>
                        <Dialog.Content>
                            <View style={{alignItems: 'flex-start'}}>
                                <FormRadioButtons
                                    onPress={this._handlePressRadioButton}
                                    options={this.props.options}
                                    flexDirection='column'
                                    checked={this.props.checked}
                                />
                            </View>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={() => this._handlePressRadioButton(this.props.checked)}>Annuler</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        );
    }
}