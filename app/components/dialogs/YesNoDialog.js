import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

export default class YesNoDialog extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AwesomeAlert
                show={this.props.showAlert}
                showProgress={false}
                title={this.props.title}
                message={this.props.message}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="Non"
                confirmText="Oui"
                confirmButtonColor="#DD6B55"
                onCancelPressed={() => {
                    this.props.cancel();
                }}
                onConfirmPressed={() => {
                    this.props.confirm();
                }}
            />
        );
    };
}
