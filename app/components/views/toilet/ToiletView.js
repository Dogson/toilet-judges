// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, View, StatusBar} from 'react-native';
import {connect} from "react-redux";
import Divider from 'react-native-divider';

// CONST


// API ENDPOINTS
import {ToiletEndpoints} from '../../../endpoints/toiletEndpoints';
import {Header} from "react-native-elements";

//COMPONENTS
import {GlobalRating} from "../../rating/GlobalRating";

//STYLES
import {GlobalStyles} from '../../../styles/styles'
import {APP_CONFIG} from "../../../config/appConfig";

class ToiletView extends React.Component {

    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);
        this.state =
            {
                toiletInfos: this.props.navigation.getParam('toilet')
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
        return (
            <View style={GlobalStyles.stackContainer}>
                <View style={GlobalStyles.sectionContainer}>
                    <GlobalRating rating={this.state.toiletInfos.globalRating} ratingCount={this.state.toiletInfos.ratingCount}></GlobalRating>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(ToiletView);