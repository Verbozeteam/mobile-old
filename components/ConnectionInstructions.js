/* @flow */

import * as React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const I18n = require('../i18n/i18n');

type PropsType = {
};

type StateType = {
};

class ConnectionInstructions extends React.Component<PropsType, StateType> {
  _arrow_img = require('../assets/images/arrow.png');

  render() {
    return (
      <View style={styles.container}>
        <Image key={'arrow'} style={styles.arrow} source={this._arrow_img}/>
        <Text style={styles.text}>{"Open the settings menu in your room's touchscreen display and scan the QR code you find there"}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    top: 80,
    fontFamily: 'CeraPRO-Bold',
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  arrow: {
    position: 'absolute',
    right: 0,
    top: 10,
    width: 60,
    height: 60,
  },
});

module.exports = { ConnectionInstructions };