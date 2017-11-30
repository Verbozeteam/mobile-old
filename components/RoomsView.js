/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const Room = require('./Room');

import { ConfigType } from '../config/ConnectionTypes';

type PropsType = {
  config: ConfigType,
};

type StateType = {
};

class RoomsView extends React.Component<PropsType, StateType> {

  render() {
    const { config } = this.props;

    var rooms = [];
    if (config.rooms) {
      for (var i = 0; i < config.rooms.length; i++) {
        rooms.push(
          <Room key={'room-view-'+i}
            roomConfig={config.rooms[i]} />
        );
      }
    }

    return (
      <View style={styles.container}>
        {rooms}
      </View>
    );
  }
}

RoomsView.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

module.exports = RoomsView;
