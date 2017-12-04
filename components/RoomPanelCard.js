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

  _container_layout = {x: 0, y: 0, width: 0, height: 0};
  _container_ref: Object;

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

    this._measure(() => {
      store.dispatch(
        PanelsActions.set_overlaying_panel(
          roomConfig.name.en, panel.name.en, this._container_layout));
    });


    // store.dispatch(PanelsActions.set_overlaying_panel(roomConfig.name.en, panel.name.en, this._currentLayout));
  }

  _measure(callback) {
    this._container_ref.measure((x, y, width, height, pageX, pageY) => {
      this._container_layout = {x: pageX, y: pageY, height, width};

      if (typeof callback == 'function')
        callback();
    });
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
        onPress={this.panelPressed.bind(this)}>
        <View
          ref={c => this._container_ref = c}
          style={[styles.card, isPressed ? styles.card_pressed : {}, layout]}
          pointerEvents={viewType === 'detail' ? "box-none" : "box-only"}>
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
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    margin: 10,
    marginBottom: 0,
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
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
