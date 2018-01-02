/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image } from 'react-native';

const thingsActions = require('../actions/things');
const SocketCommunication = require('../lib/WebSocketCommunication');
const GenericButton = require('../react-components/GenericButton');

const I18n = require('../i18n/i18n');
import { TimeoutHandler } from '../lib/TimeoutHandler';

import type { ViewType, LayoutType } from '../config/flowtypes';
import type { GenericThingType } from '../config/ConnectionTypes';

type PropsType = {
    things: Array<GenericThingType>,
    viewType: ViewType,
    layout: LayoutType,
};

type StateType = {
    curtains: {
        [string]: number,
    },
};

class CurtainsPanel extends React.Component<PropsType, StateType>  {
    _unsubscribe: () => null = () => null;

    state = {
        curtains: {},
    };

    _close_arrow = require('../assets/images/close_arrow.png');
    _open_arrow = require('../assets/images/open_arrow.png');
    _stop_button = require('../assets/images/stop_button.png');
    _curtain_img = require('../assets/images/curtain.png');

    // curtain-id -> max time needed for curtain to fully open or close
    _curtainMoveMaxTimes : {[string]: number} = {};
    // curtain-id -> time it was clicked
    _curtainClickTimes : {[string]: number} = {};

    componentWillMount() {
        const { store } = this.context;
        this._unsubscribe = store.subscribe(this.onReduxStateChanged.bind(this));
        this.onReduxStateChanged();

        var curtains_state = {};
        for (var i = 0; i < this.props.things.length; i++)
            curtains_state[this.props.things[i].id] = 0;
        this.setState({curtains: curtains_state});
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onReduxStateChanged() {
        const { store } = this.context;
        const reduxState = store.getState();
        const { curtains } = this.state;

        if (reduxState && reduxState.things && reduxState.things.things_states) {
            for (var curtain_id in curtains) {
                const my_val = curtains[curtain_id];
                const my_redux_state = reduxState.things.things_states[curtain_id];
                if (my_redux_state && my_redux_state.curtain != undefined && my_redux_state.curtain != my_val) {
                    TimeoutHandler.clearTimeout(curtain_id);
                    this._curtainMoveMaxTimes[curtain_id] = my_redux_state.moveMaxTime || 2000;
                    this.setState({curtains: {...this.state.curtains, ...{[curtain_id]: my_redux_state.curtain}}});
                }
            }
        }
    }

    setCurtainValue(curtain: GenericThingType) {
        const curtains = curtain === undefined ? this.props.things : [curtain];

        return ((value: number) => {
            var totalUpdate = {};
            var curTime = (new Date()).getTime();
            for (var i = 0; i < curtains.length; i++) {
                if (value !== 0) { // first click, record the time
                    this._curtainClickTimes[curtains[i].id] = curTime;
                } else { // ending the click, if too short, then let the curtain auto move
                    if (curTime - this._curtainClickTimes[curtains[i].id] < 500) {
                        const c = curtains[i];
                        const v = value;
                        TimeoutHandler.createTimeout(
                            curtains[i].id,
                            this._curtainMoveMaxTimes[curtains[i].id],
                            () => this.setCurtainValue(c)(v));
                        continue; // don't perform the update on this curtain, auto update will do it
                    }
                }
                totalUpdate[curtains[i].id] = {curtain: value};
            }

            if (Object.keys(totalUpdate).length > 0) {
                for (var k in totalUpdate) {
                    SocketCommunication.sendMessage({
                        thing: k,
                        ...totalUpdate[k],
                    });
                }
                this.context.store.dispatch(thingsActions.set_things_partial_states(totalUpdate));
            }
        }).bind(this);
    }

    renderCurtain(thing: GenericThingType) {
        const { things, layout, viewType } = this.props;

        var buttonWidth = layout.width / 3 - 20 - (10 * 2);
        var buttonDim = {
            width: buttonWidth,
            height: buttonWidth,
        };

        var thingId = thing !== undefined ? thing.id : "all-curtains";
        var thingName = thing !== undefined ? thing.name.en : "All";
        if (viewType === 'detail') {
            return (
                <View key={'curtain-'+thingId} style={[styles.curtain_container]}>
                    <View style={styles.stack}>
                        <Text style={styles.text}>{thingName}</Text>
                    </View>

                    <View style={[styles.stack, {height: buttonDim.height + 20}]}>
                        <View style={styles.button}>
                            <GenericButton
                                icon={this._open_arrow}
                                layout={buttonDim}
                                borderRadius={0.1}
                                pressIn={() => this.setCurtainValue(thing)(1)}
                                pressOut={() => this.setCurtainValue(thing)(0)} />
                        </View>
                        <View style={styles.button}>
                            <GenericButton
                                icon={this._stop_button}
                                layout={buttonDim}
                                borderRadius={0.1}
                                pressIn={() => this.setCurtainValue(thing)(0)} />
                        </View>
                        <View style={styles.button}>
                            <GenericButton
                                icon={this._close_arrow}
                                layout={buttonDim}
                                borderRadius={0.1}
                                pressIn={() => this.setCurtainValue(thing)(2)}
                                pressOut={() => this.setCurtainValue(thing)(0)} />
                        </View>
                    </View>
                </View>
            );
        } else {
            return (
                <View key={'curtain-'+thingId} style={[styles.curtain_container, {alignItems: 'center'}]}>
                    <Image source={this._curtain_img} style={buttonDim}></Image>
                </View>
            );
        }
    }

    render() {
        const { things, layout, viewType } = this.props;

        return (
            <View style={viewType === 'detail' ? styles.container : styles.container_sm}>
                {things.map((t, i) => this.renderCurtain(t))}
                {this.renderCurtain(undefined)}
            </View>
        );
    }
}
CurtainsPanel.contextTypes = {
    store: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    container_sm: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    curtain_container: {
        flex: 1,
        flexDirection: 'column',
    },
    stack: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        fontFamily: 'HKNova-MediumR',
        color: '#ffffff',
        backgroundColor: '#00000000',
    },
    curtain_img: {
        flex: 1,
    }
});

module.exports = CurtainsPanel;
