/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GenericToggle = require('../react-components/GenericToggle')
const LightDimmer = require('./LightDimmer');
const LightSwitch = require('./LightSwitch');
//const PresetsSwitch = require('./PresetsSwitch');

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
    renderDimmer(dimmer: GenericThingType) {
        const { viewType, layout } = this.props;

        var dimmer_name = '';
        var slider_width = layout.width - 40;
        var slider_height = 30;
        if (viewType === 'detail') {
            slider_height = 60;
            dimmer_name = I18n.t(dimmer.name.en);
        }

        return <View
            key={dimmer.id+'-container'}
            style={dimmer_styles.container}>
            <View key={dimmer.id+'-name'}
                style={dimmer_styles.name_container}>
                <Text style={dimmer_styles.name}>
                    {dimmer_name}
                </Text>
            </View>
            <LightDimmer
                key={dimmer.id}
                id={dimmer.id}
                layout={{width: slider_width, height: slider_height, top: 0, left: 0}}/>
        </View>;
    }

    renderLightSwitch(light_switch: GenericThingType) {
        const { viewType } = this.props;

        var switch_name = '';
        var switch_view = null;
        if (viewType === 'detail') {
            switch_view = (
                <View  style={{flex: 2, alignItems: 'center', justifyContent: 'center',}}>
                    <GenericToggle
                        selected={0}
                        values={['Off', 'On']}
                        actions={[() => {}, () => {}]}
                        layout={{width: 200, height: 70}}/>
                </View>
            );

            switch_name = I18n.t(light_switch.name.en);
        }

        return <View key={light_switch.id+'-container'}
            style={switch_styles.container}>
            <View key={light_switch.id+'-container-container'}
                style={switch_styles.container_container}>
                <LightSwitch
                    key={light_switch.id}
                    id={light_switch.id}
                    viewType={viewType} />
                <Text key={light_switch.id+'-name'}
                    style={[switch_styles.name, viewType === 'detail' ? {height: 30} : {}]}>
                    {switch_name}
                </Text>
            </View>
            {switch_view}
        </View>;
    }

    // renderPresetsSwitch(presets: Array<Object>) {
    //     const { viewType, layout } = this.props;
    //     var key = 'presets-'+Object.keys(presets[0]).sort()[0];

    //     return <View key={key}
    //         style={switch_styles.container}>
    //         <View key={key+'-container-container'}
    //             style={switch_styles.container_container}>
    //             <PresetsSwitch
    //                 key={key+'-switch'}
    //                 presets={presets}
    //                 viewType={viewType} />
    //             <Text key={key+'-name'}
    //                 style={[switch_styles.name, viewType === 'detail' ? {height: 100} : {}]}>
    //                 {I18n.t("Presets")}
    //             </Text>
    //         </View>
    //     </View>;
    // }

    render() {
        const { things, layout, presets, viewType } = this.props;

        var dimmers = [];
        var switches = [];
        for (var i = 0; i < things.length; i++) {
            if (things[i].category === 'dimmers')
                dimmers.push(this.renderDimmer(things[i]));
            else
               switches.push(this.renderLightSwitch(things[i]));
        }

        // if (viewType ==='detail' && presets && typeof(presets) == "object" && presets.length > 0 ) {
        //     switches.push(this.renderPresetsSwitch(presets));
        // }

        return (
            <View style={styles.container}>
                {dimmers}
                <View style={viewType === 'detail' ? [styles.switches_tall_container, {height: switches.length*100}] : styles.switches_container}>
                    {switches}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    switches_container: {
        flexDirection: 'row',
        flex: 1,
        height: 100,
    },
    switches_tall_container: {
        flexDirection: 'column',
        width: '100%',
    }
});

const dimmer_styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    name_container: {
        marginLeft: 0,
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        marginRight: 20,
        fontSize: 20,
        fontFamily: 'HKNova-MediumR',
        color: '#000000',
        backgroundColor: '#00000000',
    },
});

const switch_styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
    },
    container_container: {
        flexDirection: 'column',
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontFamily: 'HKNova-MediumR',
        color: '#000000',
        textAlign: 'center',
        backgroundColor: '#00000000',
    }
});

module.exports = LightsPanel;
