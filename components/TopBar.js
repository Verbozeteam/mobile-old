/* @flow */

import * as React from 'react';
import { View, Text, Image, Button, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

type PropsType = {
  navigation: {
    dispatch: Function,
    goBack: Function,
    navigate: Function,
    setParams: Function,
    state: Object
  },
  connection_state: 0 | 1 | 2,
  config: Object,

  backgroundColor: string
};

type StateType = {};

function mapStateToProps(state: Object) {
  return {
    connection_state: state.connection.connection_state,
    config: state.connection.config
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {

  };
}

class TopBar extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundColor: '#181B31',
  };

  _drawer_button: React.Component = null;

  _hotel_logo: number;

  componentWillMount() {
    const { navigation } = this.props;

    if (Platform.OS === 'android') {
      this._drawer_button = (
        <Button onPress={() => navigation.navigate('DrawerOpen')} title={'|||'} />
      );
    }

    this._hotel_logo = require('../assets/millennium/logo.png');
  }

  connectionStateString() {
    const { connection_state } = this.props;

    switch(connection_state) {
      case 0:
        return 'Disconnected';
      case 1:
        return 'Connecting'
      case 2:
        return 'Connected'
    }
  }

  render() {
    const { backgroundColor } = this.props;

    const room_number = '314';

    return (
      <View style={[styles.container, {backgroundColor}]}>
        <View style={styles.column}>
          <Text>{this.connectionStateString()}</Text>
        </View>
        <View style={styles.column}>
          <View style={styles.hotel_logo}>
            <Text>Hotel Logo goes here</Text>
          </View>
          <Text>Room {room_number}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: 'row'
  },
  column: {
    flex: 1
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 27,
    fontFamily: 'HKNova-MediumR'
  }
});

TopBar.contextTypes = {
  store: PropTypes.object
};

TopBar = ReduxConnect(mapStateToProps, mapDispatchToProps) (TopBar);

module.exports = TopBar;
