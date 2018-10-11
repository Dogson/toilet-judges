// LIBRAIRIES
import React from 'react';
import {BackHandler, Text, View} from 'react-native';
import {connect} from "react-redux";


// CONST


// API ENDPOINTS
import {ToiletEndpoints} from '../../endpoints/toiletEndpoints';

//COMPONENTS


class Toilet extends React.Component {
    // COMPONENT LIFE CYCLE
    constructor(props) {
        super(props);
        this.state = this.props.navigation.getParam('toilet');

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
        this.getToiletInfos();
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
    getToiletInfos() {

    }

    // RENDERING COMPONENTS
    render() {
        return <View>
            <Text>
                {this.state.placeName}
            </Text>
        </View>
    }
}

function mapStateToProps(state) {
    return {
        userRating: state.mapReducer.userRating
    };
}

export default connect(mapStateToProps)(Toilet);