// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, View, StatusBar} from 'react-native';
import {connect} from "react-redux";


// CONST


// API ENDPOINTS
import {ToiletEndpoints} from '../../endpoints/toiletEndpoints';
import {Header} from "react-native-elements";

//COMPONENTS


class ToiletView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);
        this.state =
            {
                toiletInfos : this.props.navigation.getParam('toilet')
            };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    // HANDLING EVENTS
    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    // DISPATCH ACTIONS

    // RENDERING COMPONENTS
    render() {
        return <View>

        </View>
    }
}

function mapStateToProps(state) {
    return {

    };
}

export default connect(mapStateToProps)(ToiletView);