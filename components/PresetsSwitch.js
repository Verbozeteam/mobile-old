/* @flow */

import * as React from 'react';

import PropTypes from 'prop-types';
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import type { LayoutType, ViewType } from '../config/flowtypes';

const GenericToggle = require('../react-components/GenericToggle');

const thingsActions = require('../actions/things');
const SocketCommunication = require('../lib/WebSocketCommunication');

const I18n = require('../i18n/i18n');

type StateType = {
    currentPresetIndex: number,
};

type PropsType = {
    viewType: ViewType,
    presets: Array<Object>,
    layout: Object,
};

class PresetsSwitch extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => {return null;};

    _cog_icon = require('../assets/images/cog_large.png');

    state = {
        currentPresetIndex: 0,
    };

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
        const { currentPresetIndex } = this.state;
        const { presets } = this.props;

        if (reduxState && reduxState.things && reduxState.things.things_states) {
            var distances = [];
            var lowest_dist = 100000;
            var lowest_dist_index = -1;
            for (var i = 0; i < presets.length; i++) {
                distances.push(this.computeDistanceToPreset(presets[i], reduxState.things.things_states));
                if (distances[i] < lowest_dist) {
                    lowest_dist = distances[i];
                    lowest_dist_index = i;
                }
            }

            if (lowest_dist_index == 0 && distances[0] > 0.01)
                lowest_dist_index++;
            else if (lowest_dist_index == distances.length - 1 && distances[distances.length-1] > 0.01)
                lowest_dist_index--;

            if (lowest_dist_index != currentPresetIndex)
                this.setState({currentPresetIndex: lowest_dist_index});
        }
    }

    computeDistanceToPreset(preset: Object, state: Object) {
        for (var k in preset)
            if (state[k] == undefined)
                delete preset[k];
        var preset_intensity = Object.keys(preset).map((tid) => !preset[tid].intensity ? 0 : (state[tid].category == 'dimmers' ? preset[tid].intensity / 100 : preset[tid].intensity)).reduce((a, b) => a + b);
        var state_intensity = Object.keys(state).filter((k) => k in preset).map((tid) => !state[tid].intensity ? 0 : (state[tid].category == 'dimmers' ? state[tid].intensity / 100 : state[tid].intensity)).reduce((a, b) => a + b);
        return Math.abs(preset_intensity - state_intensity);
    }

    changePreset(new_preset: number) {
        const { presets } = this.props;

        for (var k in presets[new_preset]) {
            SocketCommunication.sendMessage({
                thing: k,
                ...presets[new_preset][k],
            });
        }
        this.context.store.dispatch(thingsActions.set_things_partial_states(presets[new_preset]));
    }

    render() {
        const { presets, viewType, layout } = this.props;
        const { currentPresetIndex } = this.state;

        var on_press = (() => this.changePreset((this.state.currentPresetIndex + 1) % presets.length)).bind(this);
        var values = presets.map((p, i) => i == 0 ? I18n.t("Off") : i.toString());
        var actions = presets.map((p, i) => ((() => this.changePreset(i)).bind(this)));

        return (
            <GenericToggle values={values}
                icon={this._cog_icon}
                orientation={"horizontal"}
                layout={layout}
                sameSameValue={true}
                actions={actions}
                selected={currentPresetIndex} />
        );
    }
}
PresetsSwitch.contextTypes = {
    store: PropTypes.object
};

const styles = StyleSheet.create({
});

module.exports = PresetsSwitch;
