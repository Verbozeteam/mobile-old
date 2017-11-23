/* @flow */

import * as React from 'react';
import { View, Text, AppRegistry, StyleSheet } from 'react-native';

const ReconnectingWebsocket = require('reconnecting-websocket');

const GenericToggle = require('./react-components/GenericToggle');
const GenericSlider = require('./react-components/GenericSlider');

const LightDimmer = require('./react-components/LightDimmer');
const LightSwitch = require('./react-components/LightSwitch');
const ACControl = require('./react-components/ACControl');

type PropsType = {};

type State = {};

class VerbozeMobile extends React.Component<PropsType, StateType> {

  state = {
    dimmer: 50,
  };

  toggle_id = 'lightswitch-8';
  dimmer_id = 'dimmer-v1';

  // websocket
  _ws: Object = null;

  componentDidMount() {
    const ws_url = 'wss://www.verboze.com/stream/35b4d595ef074543a2fa686650024d98';
    this._ws = new ReconnectingWebsocket(ws_url);

    this._ws.onopen = () => {
      console.log('websocket connected.');

      this._ws.send(JSON.stringify({
        code: 0
      }));
    }

    this._ws.onclose = () => {
      console.log('websocket disconnected.');
    }

    this._ws.onerror = (error) => {
      console.log('websocket error: ' + error);
    }

    this._ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      try {
        this.setState({
          toggle1: 1 - data[this.toggle_id].intensity
        });
      }
      catch(e) {}

      try {
        this.setState({
          dimmer: data[this.dimmer_id].intensity
        });
      }
      catch(e) {}
    }
  }

  _toggleOn() {
    console.log('toggle on');
    this.setState({
      toggle1: 0
    });

    this._ws.send(JSON.stringify({thing: this.toggle_id, intensity: 1}));
  }

  _toggleOff() {
    console.log('toggle off');
    this.setState({
      toggle1: 1
    });

    this._ws.send(JSON.stringify({thing: this.toggle_id, intensity: 0}));
  }

  _onMove(v) {

    this._ws.send(JSON.stringify({thing: this.dimmer_id, intensity: v}));
  }

  _onRelease(v) {
    this.setState({
      dimmer: v
    });

    this._ws.send(JSON.stringify({thing: this.dimmer_id, intensity: v}));
  }

  render() {

    const demo_toggle = (
      <GenericToggle selected={this.state.toggle1}
        actions={[this._toggleOn.bind(this), this._toggleOff.bind(this)]} />
    );

    const demo_slider = (
      <GenericSlider orientation={'horizontal'}
        value={this.state.dimmer}
        onMove={this._onMove.bind(this)}
        onRelease={this._onRelease.bind(this)} />
    );
    //
    //
    // const demo_circular = (
    //   <GenericCircularSlider />
    // );

    return (
      <View style={styles.container}>
        <ACControl />
        {/* {demo_toggle} */}
        {/* {demo_slider} */}
        {/* <LightSwitch /> */}
        {/* <LightDimmer update={() => null}/> */}
        {/* <LightDimmer orientation={'horizontal'} update={() => null}/> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  }
});

module.exports = VerbozeMobile;
