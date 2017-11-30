/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { RoomType, PanelType } from '../config/ConnectionTypes';

const I18n = require('../i18n/i18n');

type PropsType = {
  roomConfig: RoomType,
};

type StateType = {
};

class Room extends React.Component<PropsType, StateType> {

  renderPanel(panel: PanelType) {
    const { roomConfig } = this.props;

    if (panel.things.length > 0) {
      switch (panel.things[0].category) {
        case 'dimmers':
        case 'light_switches':
          return <View><Text>{panel.name.en}</Text></View>;
        case 'hotel_controls':
          return null;
        case 'central_acs':
          return null;
      }
    }

    return null;
  }

  render() {
    const { roomConfig } = this.props;

    var panels = [];
    for (var i = 0; i < roomConfig.grid.length; i++) {
      for (var j = 0; j < roomConfig.grid[i].panels.length; j++) {
        var panel = roomConfig.grid[i].panels[j];
        panels.push(
          <View key={'panel-'+panel.name.en+'-'+roomConfig.name.en}>
            {this.renderPanel(panel)}
          </View>
        );
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.room_name}>
          {I18n.t(roomConfig.name.en)}
        </Text>
        <View style={styles.card}>
          {panels}
        </View>
      </View>
    );
  }
}

Room.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
  },
  room_name: {
    height: 50,
    fontSize: 32,
    marginLeft: 10,

  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
  },
});

module.exports = Room;
