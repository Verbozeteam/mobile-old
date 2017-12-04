/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { ViewType } from '../config/flowtypes';
import { RoomType, PanelType } from '../config/ConnectionTypes';

const HotelControlsPanelContents = require('./HotelControlsPanelContents');
const CentralAC = require('./CentralAC');
const LightsPanel = require('./LightsPanel');
const PanelsActions = require('../actions/panels');

const I18n = require('../i18n/i18n');

type PropsType = {
  panel: PanelType,
  roomConfig: RoomType,
  viewType: ViewType,
  layout?: any,
};

type StateType = {
  isPressed: boolean,
};

class RoomPanelCard extends React.Component<PropsType, StateType> {
  state = {
    isPressed: false,
  }

  _currentLayout = {x: 0, y: 0, width: 0, height: 0};

  onLayout(nativeEvent: any) {
    this.refs.CardView.measure(((x, y, width, height, pageX, pageY) => {
      this._currentLayout = {
        x: pageX + x,
        y: pageY + y,
        width, height,
      };
    }).bind(this));
  }

  panelPressedIn() {
    const { panel } = this.props;
    // this.setState({
    //   isPressed: true,
    // });
  }

  panelPressedOut() {
    const { panel } = this.props;
    // this.setState({
    //   isPressed: false,
    // });
  }

  panelPressed() {
    const { panel, roomConfig } = this.props;
    const { store } = this.context;
    store.dispatch(PanelsActions.set_overlaying_panel(roomConfig.name.en, panel.name.en, this._currentLayout));
  }

  render() {
    const { isPressed } = this.state;
    const { panel, viewType, layout } = this.props;

    var rendered_panel = null;
    if (panel.things.length > 0) {
      switch (panel.things[0].category) {
        case 'dimmers':
        case 'light_switches':
          rendered_panel = (
            <LightsPanel
              things={panel.things}
              viewType={viewType}
              layout={{width: Dimensions.get('window').width - (isPressed ? 40 : 60), height: 24}}
              presets={panel.presets} />
          );
          break;
        case 'hotel_controls':
          rendered_panel = (
            <HotelControlsPanelContents
              id={panel.things[0].id}
              viewType={viewType}/>
          );
          break;
        case 'central_acs':
          rendered_panel = (
            <CentralAC
              id={panel.things[0].id}
              layout={layout}
              viewType={viewType} />
          );
          break;
      }
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={this.panelPressedIn.bind(this)}
        onPressOut={this.panelPressedOut.bind(this)}
        onPress={this.panelPressed.bind(this)}
        onLayout={this.onLayout.bind(this)}>
        <View
          ref="CardView"
          style={[styles.card, isPressed ? styles.card_pressed : {}, layout]}
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
    flex: 1,
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
