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
  _img_qr = require('../assets/images/scan_qr.png');
  _img_scanning = require('../assets/images/scan_qr.png');

  _steps = [
    ["1: Open the settings menu on the room's touchscreen"],
    ["2: Press on ", <Image key={'qr_icon'} style={styles.inline_icon} source={this._img_qr}></Image>],
    ["3: Scan the QR code you see on the touchscreen"],
    [<Image key={'qr_scanning'} source={this._img_scanning}></Image>]
  ];

  render() {
    var steps = [];

    for (var i = 0; i < this._steps.length; i++) {
      var items = [];
      for (var j = 0; j < this._steps[i].length; j++) {
        var item = this._steps[i][j];
        if (typeof item === 'string')
          items.push(<Text key={'item-'+i+'-'+j} style={styles.text}>{item}</Text>)
        else
          items.push(item);
      }
      steps.push(
        <View key={'step-'+i} style={styles.step}>
          {items}
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {steps}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'CeraPRO-Bold',
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: '#00000000',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  inline_icon: {
    width: 40,
    height: 40,
  }
});

module.exports = { ConnectionInstructions };