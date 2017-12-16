/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import LinearGradient from 'react-native-linear-gradient';

const I18n = require('../i18n/i18n');

type PropsType = {
  onPress: () => null,
};

type StateType = {
  close_button_pressed: boolean,
};

class CloseButton extends React.Component<PropsType, StateType> {
  state = {
    close_button_pressed: false
  };

  _close_button_gradient: [string, string] = ['#EB4755', '#950011'];
  _close_button_highlight: [string, string] = ['#FF5B69', '#A90E25'];

  closePressedIn() {
    this.setState({
      close_button_pressed: true
    });
  }

  render() {
    const { onPress } = this.props;
    const { close_button_pressed } = this.state;

    var close_button_gradient = close_button_pressed ? this._close_button_highlight : this._close_button_gradient;

    return (
      <View onTouchStart={this.closePressedIn.bind(this)}
        onTouchEnd={onPress}
        style={styles.close_button}>
        <LinearGradient colors={close_button_gradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{flex: 1}}>
          <Text style={styles.close_button_text}>
            Close
          </Text>
        </LinearGradient>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  close_button: {
    flex: 1,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  close_button_text: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'CeraPRO-Bold',
    color: '#FFFFFF',
    fontSize: 17,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

module.exports = CloseButton;