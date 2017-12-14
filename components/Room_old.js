/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

import { RoomType, PanelType } from '../config/ConnectionTypes';

const RoomPanelCard = require('./RoomPanelCard');

const I18n = require('../i18n/i18n');

type PropsType = {
  roomConfig: RoomType,
  showRoomName: boolean
};

type StateType = {};

class Room extends React.Component<PropsType, StateType> {

  static defaultProps = {
    showRoomName: false
  };

  _scroll_view_ref: Object;
  _offset: number = 0;

  render() {
    const { roomConfig, showRoomName } = this.props;

    var header: React.Component = null;
    if (showRoomName) {
      header = (
        <View style={styles.header}>
          <Text style={styles.room_name}>
            {I18n.t(roomConfig.name.en)}
          </Text>
        </View>
      );
    }

    var panels = [];
    for (var i = 0; i < roomConfig.grid.length; i++) {
      for (var j = 0; j < roomConfig.grid[i].panels.length; j++) {
        const panel = roomConfig.grid[i].panels[j];
        panels.push(
          <RoomPanelCard
            key={'panel' + panel.name.en + '-' + roomConfig.name.en}
            panel={panel}
            roomConfig={roomConfig}
            viewType={'collapsed'} />
        );
      }
    }

    return (
      <View style={styles.container}>
        {header}
        <ScrollView ref={c => this._scroll_view_ref = c}
          style={styles.scroll_view}>
          {panels}
        </ScrollView>
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
  scroll_view: {
    flex: 1
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    // borderBottomWidth: 1,
    // borderColor: '#9EABCB',
    paddingRight: 10,
    paddingLeft: 10,
  },
  room_name: {
    fontSize: 27,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});

module.exports = Room;
