import * as React from "react";
import Menu, {
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import {Icon} from "react-native-elements";
import {GlobalStyles} from "../../../styles/styles";
import {STYLE_VAR} from "../../../styles/stylingVar";
import {Text, View} from "react-native";

export class SortDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCheckIcon() {
        return <Icon name="check" color={STYLE_VAR.backgroundDefault} containerStyle={{paddingRight: 10}}/>
    }

    render() {
        return <Menu>
            <MenuTrigger>
                    <Icon color={STYLE_VAR.backgroundDefault} name="sort" size={25}/>
            </MenuTrigger>
            <MenuOptions customStyles={{
                optionsContainer: {right: 0, paddingVertical: 15, width: 'auto'}
            }}>
                {this.props.options.map((option, i) => {
                    return <MenuOption key={i} onSelect={() => {
                        this.props.onSelect(i)
                    }}>
                        <View style={[GlobalStyles.flexRowSpaceBetween, {
                            flex: 1,
                            alignItems: 'center',
                            paddingVertical: 5,
                            paddingHorizontal: 10
                        }]}>
                            {this.props.selected === i && this.renderCheckIcon()}
                            <Text style={GlobalStyles.primaryText}>{option}</Text>
                        </View>
                    </MenuOption>
                })}
            </MenuOptions>
        </Menu>
    }
}