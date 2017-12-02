/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const PanelsActions = require('../actions/panels');

const LightsPanel = require('./LightsPanel');

const I18n = require('../i18n/i18n');

function mapStateToProps(state: Object) {
  return {
    overlaying_room_name: state.panels.overlaying_room_name,
    overlaying_panel_name: state.panels.overlaying_panel_name,
    config: state.connection.config,
  };
}

class RoomPanelOverlay extends React.Component<any, any> {
  _cancel_image = require('../assets/images/close.png');

  findSelectedPanel() {
    const { overlaying_room_name, overlaying_panel_name, config } = this.props;

    if (overlaying_panel_name != "" && config) {
      try {
        for (var r = 0; r < config.rooms.length; r++) {
          var roomConfig = config.rooms[r];
          if (roomConfig.name.en === overlaying_room_name) {
            for (var i = 0; i < roomConfig.grid.length; i++) {
              for (var j = 0; j < roomConfig.grid[i].panels.length; j++) {
                if (roomConfig.grid[i].panels[j].name.en === overlaying_panel_name) {
                  return roomConfig.grid[i].panels[j];
                }
              }
            }
          }
        }
      } catch(e) {}
    }

    return null;
  }

  cancelOverlay() {
    this.context.store.dispatch(PanelsActions.set_overlaying_panel("", ""));
  }

  render() {
    var panel = this.findSelectedPanel();

    if (!panel)
      return <View />;

    var rendered_panel = null;
    if (panel.things.length > 0) {
      switch (panel.things[0].category) {
        case 'dimmers':
        case 'light_switches':
          rendered_panel = (
            <LightsPanel
              things={panel.things}
              viewType={'detail'}
              layout={{width: Dimensions.get('window').width, height: 40}}
              presets={panel.presets}/>
          );
        case 'hotel_controls':
          break;
        case 'central_acs':
          break;
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.header_container}>
          <Text style={styles.header_text}>{I18n.t(panel.name.en)}</Text>
          <View style={styles.cancel_container}>
            <TouchableWithoutFeedback
                onPressIn={this.cancelOverlay.bind(this)}>
              <Image style={styles.cancel_image}
                resizeMode='contain'
                source={this._cancel_image}>
              </Image>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.panel_container}>
          {rendered_panel}
        </View>
      </View>
    );
  }
}

RoomPanelOverlay.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#FFFFFF'
  },
  header_container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    padding: 5,
    paddingLeft: 10,
  },
  header_text: {
    color: '#000000',
    fontSize: 32,
    flex: 1,
  },
  cancel_container: {
    width: 60,
  },
  cancel_image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  panel_container: {
    flex: 1,
  }
});

module.exports = ReduxConnect(mapStateToProps) (RoomPanelOverlay);
