/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const I18n = require('../i18n/i18n');

import LinearGradient from 'react-native-linear-gradient';

const HotelControlsPanelContents = require('./HotelControlsPanelContents');
const CentralAC = require('./CentralAC');
const LightsPanel = require('./LightsPanel');
const PanelsActions = require('../actions/panels');

type PropsType = {
  backgroundGradient?: [string, string],
  highlightGradient?: [string, string],
  active: boolean,
  viewType: string
};
type StateType = {
  pressed: boolean
};

class RoomPanelCard extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundGradient: ['#384D66', '#182434'],
    highlightGradient: ['#425770', '#222e3e'],
    active: true,
    viewType: 'collapsed'
  };

  state = {
    pressed: false
  }

  _container_ref: Object;
  _container_layout: LayoutType;

  panelPressedIn() {
    const { active, viewType } = this.props;

    if (!active || viewType === 'detail') {
      return;
    }

    this.setState({
      pressed: true
    });
  }

  panelPressedOut() {
    const { active, viewType } = this.props;

    if (!active || viewType === 'detail') {
      return;
    }

    this.setState({
      pressed: false
    });
  }

  panelPressed() {
    const { onPress, active, roomConfig, panel } = this.props;
    const { store } = this.context;

    if (!active) {
      return;
    }

    this._measure(() => {
      store.dispatch(
        PanelsActions.set_overlaying_panel(
          roomConfig.name.en, panel.name.en, this._container_layout
        )
      );
    });
  }

  _measure(callback) {
    this._container_ref.measure((x, y, width, height, pageX, pageY) => {
      this._container_layout = {x: pageX, y: pageY, height, width};

      if (typeof callback == 'function') {
        callback();
      }
    });
  }

  render() {
    const { panel, highlightGradient, active, viewType } = this.props;
    var { backgroundGradient } = this.props;
    const { pressed } = this.state;

    const header: React.Component = (
      <View style={styles.header}>
        <Text style={styles.header_text}>
          {I18n.t(panel.name.en).toUpperCase()}
        </Text>
      </View>
    );

    var content: React.Component = null;
    if (panel.things.length > 0) {
      switch (panel.things[0].category) {
        case 'dimmers':
        case 'light_switches':
          content = (
            <LightsPanel
              things={panel.things}
              viewType={viewType}
              layout={{width: 200}}
              presets={panel.presets} />
          );
          break;
        case 'hotel_controls':
          content = (
            <HotelControlsPanelContents
              id={panel.things[0].id}
              viewType={viewType}/>
          );
          break;
        case 'central_acs':
          content = (
            <CentralAC
              id={panel.things[0].id}
              viewType={viewType} />
          );
          break;
      }
    }

    if (pressed) {
      backgroundGradient = highlightGradient;
    }

    // TODO: flex: 1 doesn't work on Android, the container's height comes from
    // child node 'content' when collapsed and parent node 'RoomPanelOverlay'
    // when in detail view type
    // height: '100%',
    const container = {};
    if (viewType === 'detail') {
      container.height = '100%';
    } else {
      container.flex = 1;
    }

    return (
      <TouchableWithoutFeedback
        onPressIn={this.panelPressedIn.bind(this)}
        onPressOut={this.panelPressedOut.bind(this)}
        onPress={this.panelPressed.bind(this)}>
        <View ref={c => this._container_ref = c}
          pointerEvents={(viewType === 'detail') ? 'box-none' : 'box-only'}
          style={[styles.container, container]}>
          <LinearGradient colors={backgroundGradient}
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            style={styles.card}>
            {header}
            <View style={styles.content_container}>
              {content}
            </View>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

RoomPanelCard.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    padding: 10
  },
  content_container: {
    flex: 1,
    // marginTop: 5,
    width: '100%'
  },
  header: {

  },
  header_text: {
    fontFamily: 'CeraPRO-Bold',
    fontSize: 17,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

module.exports = RoomPanelCard;
