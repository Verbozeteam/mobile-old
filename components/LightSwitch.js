/* @flow */

import * as React from 'react';

import PropTypes from 'prop-types';
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import type { ViewType } from '../config/flowtypes';

const thingsActions = require('../actions/things');
const SocketCommunication = require('../lib/WebSocketCommunication');

const I18n = require('../i18n/i18n');

type StateType = {
    intensity: number,
};

type PropsType = {
    id: string,
    viewType: ViewType,
};

class LightSwitch extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => {return null;};

    state = {
        intensity: 0,
    };

    _light_bulb_img_on = require('../assets/images/lighton.png');
    _light_bulb_img_off = require('../assets/images/lightoff.png');

    componentWillMount() {
        const { store } = this.context;
        this._unsubscribe = store.subscribe(this.onReduxStateChanged.bind(this));
        this.onReduxStateChanged();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onReduxStateChanged() {
        const { store } = this.context;
        const reduxState = store.getState();
        const { intensity } = this.state;
        const { id } = this.props;

        if (reduxState && reduxState.things && reduxState.things.things_states) {
            const my_redux_state = reduxState.things.things_states[id];
            if (my_redux_state && my_redux_state.intensity != undefined && my_redux_state.intensity != intensity) {
                this.setState({intensity: my_redux_state.intensity});
            }
        }
    }

    changeIntensity(intensity: number) {
        SocketCommunication.sendMessage({
            thing: this.props.id,
            intensity
        });
        this.context.store.dispatch(thingsActions.set_thing_partial_state(this.props.id, {intensity}));
    }

    render() {
        const { id, viewType } = this.props;
        const { intensity } = this.state;
        const light_bulb_img = intensity ? this._light_bulb_img_on : this._light_bulb_img_off;

        var on_press = (() => this.changeIntensity(1-this.state.intensity)).bind(this);

        return (
            <TouchableWithoutFeedback
                onPressIn={on_press}>
                <Image style={styles.light_bulb}
                    fadeDuration={0}
                    resizeMode='contain'
                    source={light_bulb_img}>
                </Image>
            </TouchableWithoutFeedback>
        );
    }
}
LightSwitch.contextTypes = {
    store: PropTypes.object
};

const styles = StyleSheet.create({
    light_bulb: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

module.exports = LightSwitch;
