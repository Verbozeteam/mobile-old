/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const thingsActions = require('../actions/things');
const SocketCommunication = require('../lib/WebSocketCommunication');

const GenericToggle = require('../react-components/GenericToggle')
const LightDimmer = require('./LightDimmer');
const LightSwitch = require('./LightSwitch');
const PresetsSwitch = require('./PresetsSwitch');

const I18n = require('../i18n/i18n');

import type { ViewType, LayoutType } from '../config/flowtypes';
import type { GenericThingType } from '../config/ConnectionTypes';

type PropsType = {
    things: Array<GenericThingType>,
    viewType: ViewType,
    layout: LayoutType,
    presets?: Array<Object>,
};

class LightsPanel extends React.Component<PropsType>  {

    changeIntensity(lightid: string, intensity: number) {
        SocketCommunication.sendMessage({
            thing: lightid,
            intensity
        });
        this.context.store.dispatch(thingsActions.set_thing_partial_state(lightid, {intensity}));
    }

    renderDimmer(dimmer: GenericThingType) {
        const { viewType, layout } = this.props;

        var dimmer_name = '';
        var slider_width = layout.width - 50;
        var slider_height = 30;
        if (viewType === 'detail') {
            slider_height = 50;
            dimmer_name = I18n.t(dimmer.name.en);
            slider_width = layout.width - 30;
        }

        return (
            <View key={'dimmer-row-'+dimmer.name.en} style={styles.row}>
                <LightDimmer
                    key={dimmer.id}
                    id={dimmer.id}
                    name={I18n.t(dimmer.name.en)}
                    viewType={viewType}
                    layout={{width: slider_width, height: slider_height, top: 0, left: 0}}/>
            </View>
        );
    }

    renderLightSwitch(light_switch: GenericThingType) {
        const { viewType } = this.props;

        var switch_name = '';
        var switch_view = null;
        if (viewType === 'detail')
            switch_name = I18n.t(light_switch.name.en);

        return (
            <View key={'lightswitch-'+light_switch.name.en} style={styles.column}>
                <View key={light_switch.id+'-container-container'}
                    style={styles.switch_container}>
                    <LightSwitch
                        key={light_switch.id}
                        id={light_switch.id}
                        viewType={viewType} />
                    <Text key={light_switch.id+'-name'}
                        style={styles.switch_name}>
                        {switch_name}
                    </Text>
                </View>
            </View>
        );
    }

    renderPresetsSwitch(presets: Array<Object>) {
        const { viewType, layout } = this.props;
        var key = 'presets-'+Object.keys(presets[0]).sort()[0];

        return (
            <View  key={key} style={[styles.row, styles.separatorTop]}>
                <View style={styles.column}>
                    <PresetsSwitch
                        key={key+'-switch'}
                        presets={presets}
                        viewType={viewType}
                        layout={{width: presets.length * 75, height: 50}} />
                </View>
            </View>
        );
    }

    render() {
        const { things, layout, presets, viewType } = this.props;

        var dimmer_rows = [];
        var switch_rows = [];
        var preset_rows = [];
        var switch_columns = [];

        if (viewType ==='detail' && presets && typeof(presets) == "object" && presets.length > 0)
            preset_rows.push(this.renderPresetsSwitch(presets));

        for (var i = 0; i < things.length; i++) {
            if (things[i].category === 'dimmers')
                dimmer_rows.push(this.renderDimmer(things[i]));
            else
               switch_columns.push(this.renderLightSwitch(things[i]));
        }

        for (var i = 0; i < switch_columns.length; i += 2) {
            var switches = [switch_columns[i]];
            if (i < switch_columns.length - 1)
                switches.push(switch_columns[i+1]);
            else
                switches.push(<View key={'switch-placeholder-'+i} style={styles.column} />);

            switch_rows.push(<View key={'switch-row-'+i} style={styles.row2}>{switches}</View>);
        }

        var switch_rows_container_style = {
            flex: 2,
            flexDirection: 'row',
        };
        if (viewType === 'detail') {
            switch_rows_container_style = {
                flex: switch_rows.length * 2,
                flexDirection: 'column',
            };
        }

        return (
            <View style={styles.container}>
                {dimmer_rows}
                <View style={[switch_rows_container_style, viewType === 'detail' ? styles.separatorTop : {}]}>
                    {switch_rows}
                </View>
                {preset_rows}
            </View>
        );
    }
}
LightsPanel.contextTypes = {
    store: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    row: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    row2: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    separatorTop: {
        borderTopWidth: 0,
        borderTopColor: '#1D2429',
    },
    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switch_name: {
        position: 'absolute',
        bottom: 5,
        fontSize: 18,
        fontFamily: 'HKNova-MediumR',
        color: '#ffffff',
        textAlign: 'center',
        backgroundColor: '#00000000',
    },
    switch_container: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    presets_text: {
        fontSize: 18,
        fontFamily: 'HKNova-MediumR',
        color: '#ffffff',
        backgroundColor: '#00000000',
    },
});

module.exports = LightsPanel;
