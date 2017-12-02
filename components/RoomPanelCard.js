/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { RoomType, PanelType } from '../config/ConnectionTypes';

const LightsPanel = require('./LightsPanel');
const PanelsActions = require('../actions/panels');

const I18n = require('../i18n/i18n');

type PropsType = {
  panel: PanelType,
  roomConfig: RoomType,
};

type StateType = {
  isPressed: boolean,
};

class RoomPanelCard extends React.Component<PropsType, StateType> {
  state = {
    isPressed: false,
  }

  panelPressedIn() {
    const { panel } = this.props;
    this.setState({
      isPressed: true,
    });
  }

  panelPressedOut() {
    const { panel } = this.props;
    this.setState({
      isPressed: false,
    });
  }

  panelPressed() {
    const { panel, roomConfig } = this.props;
    const { store } = this.context;
    store.dispatch(PanelsActions.set_overlaying_panel(roomConfig.name.en, panel.name.en));
  }

  render() {
    const { isPressed } = this.state;
    const { panel } = this.props;

    var rendered_panel = null;
    if (panel.things.length > 0) {
      switch (panel.things[0].category) {
        case 'dimmers':
        case 'light_switches':
          rendered_panel = (
            <LightsPanel
              things={panel.things}
              viewType={'collapsed'}
              layout={{width: Dimensions.get('window').width - (isPressed ? 40 : 60), height: 24}}
              presets={panel.presets}/>
          );
        case 'hotel_controls':
          break;
        case 'central_acs':
          break;
      }
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={this.panelPressedIn.bind(this)}
        onPressOut={this.panelPressedOut.bind(this)}
        onPress={this.panelPressed.bind(this)}>
        <View
          style={[styles.card, isPressed ? styles.card_pressed : {}]}
          pointerEvents={"box-only"}>
          <Text style={styles.card_name}>{I18n.t(panel.name.en)}</Text>
          {rendered_panel}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

RoomPanelCard.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginBottom: 0,
    minHeight: 100,
  },
  card_pressed: {
    marginLeft: 0,
    marginRight: 0,
  },
  card_name: {
    fontSize: 20,
    marginBottom: 10,
  },
});

module.exports = RoomPanelCard;
