/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const Room = require('./Room');

import { ConfigType } from '../config/ConnectionTypes';

function mapStateToProps(state: Object) {
  return {
    config: state.connection.config
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {

  };
}

class RoomsView extends React.Component<any, any> {

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

RoomsView = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomsView);

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    flexDirection: 'column',
  },
});

module.exports = RoomsView;
