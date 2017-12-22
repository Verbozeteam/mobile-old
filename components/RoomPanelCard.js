/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import * as ConnectionTypes from '../config/ConnectionTypes';

const I18n = require('../i18n/i18n');

import LinearGradient from 'react-native-linear-gradient';

const HotelControlsPanelContents = require('./HotelControlsPanelContents');
const CentralAC = require('./CentralAC');
const LightsPanel = require('./LightsPanel');

type PropsType = {
  panel: ConnectionTypes.PanelType,
  backgroundGradient?: [string, string],
  highlightGradient?: [string, string],
  viewType: string
};
type StateType = {
};

class RoomPanelCard extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundGradient: ['#384D66', '#182434'],
    highlightGradient: ['#425770', '#222e3e'],
    viewType: 'collapsed'
  };

  state = {
  }

  _container_ref: Object;
  _container_layout: LayoutType;

  _measure(callback) {
    this._container_ref.measure((x, y, width, height, pageX, pageY) => {
      this._container_layout = {x: pageX, y: pageY, height, width};

      if (typeof callback == 'function') {
        callback();
      }
    });
  }

  render() {
    const { panel, highlightGradient, viewType } = this.props;
    var { backgroundGradient } = this.props;

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
              layout={{width: Dimensions.get('screen').width-10}}
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
              viewType={viewType}
              layout={{height: Dimensions.get('screen').height-250, width: Dimensions.get('screen').width-10}} />
          );
          break;
      }
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
      <View ref={(c: Object) => {this._container_ref = c}}
        pointerEvents={(viewType === 'detail') ? 'box-none' : 'box-only'}
        style={[styles.container, container]}>
          <LinearGradient colors={['#1c2f4f', '#0f1f3f']}
            start={{x: 1, y: 0}} end={{x: 0, y: 1}}
            style={styles.card}>
            {header}
            <View style={styles.content_container}>
              {content}
            </View>
          </LinearGradient>
      </View>
    );
  }
}

RoomPanelCard.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    overflow: 'hidden',
    flex: 1,
  },
  card: {
    flex: 1,
    padding: 10,
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
