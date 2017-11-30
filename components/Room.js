/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { RoomType } from '../config/ConnectionTypes';

const I18n = require('../i18n/i18n');

type PropsType = {
  roomConfig: RoomType,
};

type StateType = {
};

class Room extends React.Component<PropsType, StateType> {

  render() {
    const { roomConfig } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.room_name}>
          {I18n.t(roomConfig.name.en)}
        </Text>
      </View>
    );
  }
}

Room.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  room_name: {
    fontSize: 32
  }
});

module.exports = Room;
