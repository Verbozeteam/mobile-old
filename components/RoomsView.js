/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const Room = require('./Room');

function mapStateToProps(state: Object) {
  return {
    config: state.connection.config
  };
}

class RoomsView extends React.Component<any, any> {

  render() {
    const { config } = this.props;

    var rooms = [];
    if (config && config.rooms) {
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
    marginBottom: 0,
    flex: 1,
    flexDirection: 'column',
  },
});

module.exports = ReduxConnect(mapStateToProps) (RoomsView);
