/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { RoomType, PanelType } from '../config/ConnectionTypes';

const LightsPanel = require('./LightsPanel');

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
          return (
            <LightsPanel
              things={panel.things}
              viewType={'collapsed'}
              layout={{width: Dimensions.get('window').width - 40, height: 24}}
              presets={panel.presets}/>
          );
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
          <View key={'panel-'+panel.name.en+'-'+roomConfig.name.en}
            style={styles.card}>
            <Text style={styles.card_name}>{I18n.t(panel.name.en)}</Text>
            {this.renderPanel(panel)}
          </View>
        );
      }
    }

    console.log(panels);

    return (
      <View style={styles.container}>
        <Text style={styles.room_name}>
          {I18n.t(roomConfig.name.en)}
        </Text>
        <ScrollView style={styles.cardholder}>
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
  cardholder: {
    flex: 1,
    flexDirection: 'column',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    minHeight: 100,
    marginBottom: 10,
  },
  card_name: {
    fontSize: 20,
    marginBottom: 10,
  },
});

module.exports = Room;
