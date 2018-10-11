import React from 'react';
import {ToiletRating} from "./ToiletRating"

export class GlobalRating extends React.Component {
    render() {
        return <ToiletRating rating={this.props.rating}></ToiletRating>
    }
}
