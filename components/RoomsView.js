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
          <View key={'room-card-'+i}>
            <Room roomConfig={config.rooms[i]} />
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>
        {rooms[0]}
      </View>
    );
  }
}

RoomsView.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    flexDirection: 'column',
  },
});

module.exports = RoomsView;
