/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const connectionActions = require('../actions/connection');

import QRCodeScanner from 'react-native-qrcode-scanner';

type PropsType = {};
type StateType = {
  token: string
};

class QRView extends React.Component<PropsType, StateType> {
  _unsubscribe: () => null = () => null;

  state = {
    token: ''
  };

  componentWillUnmount() {
    this._unsubscribe();

    console.log('unmounting');
  }

  component

  _onRead(event) {
    const token = event.data;

    this.context.store.dispatch(connectionActions.setWebSocketUrl(token));

    this.setState({
      token
    });
  }

  render() {
    const { token } = this.state;

    return (
      <View style={styles.container}>
        <QRCodeScanner onRead={this._onRead.bind(this)}
          reactivate={true}
          showMarker={true} />
        <Text style={styles.token}>
          {token}
        </Text>
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
  },
  token: {
    textAlign: 'center'
  }
});

module.exports = QRView;
