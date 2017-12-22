/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const connectionActions = require('../actions/connection');

const CloseButton = require('./CloseButton');

import QRCodeScanner from 'react-native-qrcode-scanner';

type PropsType = {};
type StateType = {
  token: string
};

class QRView extends React.Component<PropsType, StateType> {
  state = {
    token: ''
  };

  componentWillUnmount() {
  }

  _onRead(event) {
    if (event === undefined || event.data === undefined  || this.state.token !== ''){
      this.context.store.dispatch(connectionActions.setQRReaderState(false));
      return;
    }

    const token = event.data;

    if (token !== this.state.token) {
      this.setState({
        token
      });
      this.context.store.dispatch(connectionActions.setWebSocketUrl(token, true));
    }
  }

  render() {
    const { token } = this.state;

    return (
      <View style={styles.container}>
        <QRCodeScanner onRead={this._onRead.bind(this)}
          showMarker={true} />

        <View style={[styles.close_container, {width: Dimensions.get('screen').width-10}]}>
          <CloseButton onPress={this._onRead.bind(this)} />
        </View>
      </View>
    );
  }
}

QRView.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  token: {
    textAlign: 'center'
  },
  close_container: {
    height: 40,
    bottom: 5,
  },
});

module.exports = QRView;
