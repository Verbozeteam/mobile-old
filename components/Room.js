/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { RoomType, PanelType } from '../config/ConnectionTypes';

const RoomPanelCard = require('./RoomPanelCard');

const I18n = require('../i18n/i18n');

type PropsType = {
  roomConfig: RoomType,
};

type StateType = {
};

class Room extends React.Component<PropsType, StateType> {

  _scroll_view_ref: Object;

  _offset: number = 0;

  componentDidMount() {
    // setInterval(() => {
    //   this._scroll_view_ref.scrollTo({x: 0, y: this._offset, animated: true});
    //   this._offset += 10;
    // }, 1000);
  }

  render() {
    const { roomConfig } = this.props;

    var panels = [];
    for (var i = 0; i < roomConfig.grid.length; i++) {
      for (var j = 0; j < roomConfig.grid[i].panels.length; j++) {
        const panel = roomConfig.grid[i].panels[j];
        panels.push(
          <RoomPanelCard
            key={'panel-'+panel.name.en+'-'+roomConfig.name.en}
            panel={panel}
            roomConfig={roomConfig}
            viewType={'collapsed'} />
        );
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.room_name}>
          {I18n.t(roomConfig.name.en)}
        </Text>
        <ScrollView ref={c => this._scroll_view_ref = c}
          style={styles.panel_scroller}>
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
  room_name: {
    height: 50,
    fontSize: 32,
    marginLeft: 10,
  },
  panel_scroller: {
    flex: 1,
    flexDirection: 'column',
  },
});

module.exports = Room;
