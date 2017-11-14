/* @flow */

import * as React from 'react';
import { View, Text, AppRegistry, StyleSheet } from 'react-native';

const GenericToggle = require('./components/GenericToggle');
const GenericSlider = require('./components/GenericSlider');

type PropsType = {};

type State = {};

class VerbozeMobile extends React.Component<PropsType, StateType> {

  state = {};

  // websocket
  _ws: Object = null;

  componentDidMount() {

  }

  render() {

    return (
      <View style={styles.container}>
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
