/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, Image, LayoutAnimation, Platform, UIManager, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const PanelsActions = require('../actions/panels');

const LightsPanel = require('./LightsPanel');
const RoomPanelCard = require('./RoomPanelCard');

const I18n = require('../i18n/i18n');

function mapStateToProps(state: Object) {
  return {
    overlaying_room_name: state.panels.overlaying_room_name,
    overlaying_panel_name: state.panels.overlaying_panel_name,
    background_layout: state.panels.background_layout,
    config: state.connection.config,
  };
}

type StateType = {
  /**
   * 0: no panel is selected for overlay, render one if available
   * 1: a panel has been rendered small, render the big one now
   * 2: big panel has been rendered, and should be collapsing now
   * 3: big panel finished collapsing, stop the render
   */
  animation_stage: number,
}

class RoomPanelOverlay extends React.Component<any, StateType> {
  state = {
    animation_stage: 0,
  };

  _cancel_image = require('../assets/images/close.png');

  constructor(props: any) {
    super(props);

    if (Platform.OS === 'android')
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

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

  findSelectedRoom() {
    const { overlaying_room_name, overlaying_panel_name, config } = this.props;

    if (overlaying_room_name != "" && config) {
      try {
        for (var r = 0; r < config.rooms.length; r++) {
          var roomConfig = config.rooms[r];
          if (roomConfig.name.en === overlaying_room_name) {
            return roomConfig;
          }
        }
      } catch(e) {}
    }

    return null;
  }

  animationFrame() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({
      animation_stage: (this.state.animation_stage + 1) % 4,
    });

    if (this.state.animation_stage == 3)
      this.context.store.dispatch(PanelsActions.set_overlaying_panel("", "", {}));
  }

  render() {
    const { background_layout } = this.props;
    const { animation_stage } = this.state;

    var room = this.findSelectedRoom();
    var panel = this.findSelectedPanel();

    if (!panel)
      return <View />;

    var panel_layout = {
      left: 0,
      top: 0,
      borderRadius: 0,
      width: Dimensions.get('screen').width,
      height: Dimensions.get('screen').height,
      backgroundColor: '#ffffff',
    };
    if (animation_stage == 0 || animation_stage == 2 || animation_stage == 3) {
      if (!(animation_stage == 0 && Object.keys(background_layout).length == 0))
        requestAnimationFrame(this.animationFrame.bind(this));
      panel_layout = {
        left: background_layout.x,
        top: background_layout.y,
        width: background_layout.width,
        height: background_layout.height,
        borderRadius: 15,
        backgroundColor: '#ffffff',
      };
    }

    var header = null;
    // if (animation_stage == 1) {
    //   header = (
    //     <View style={styles.header_container}>
    //       <Text style={styles.header_text}>{I18n.t(panel.name.en)}</Text>
    //       <View style={styles.cancel_container}>
    //         <TouchableWithoutFeedback
    //             onPressIn={this.animationFrame.bind(this)}>
    //           <Image style={styles.cancel_image}
    //             resizeMode='contain'
    //             source={this._cancel_image}>
    //           </Image>
    //         </TouchableWithoutFeedback>
    //       </View>
    //     </View>
    //   );
    // }
    if (animation_stage == 1) {
      header = (
        <View style={styles.cancel_container}>
          <TouchableWithoutFeedback
              onPressIn={this.animationFrame.bind(this)}>
            <Image style={styles.cancel_image}
              resizeMode='contain'
              source={this._cancel_image}>
            </Image>
          </TouchableWithoutFeedback>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.card_container, panel_layout]}>
          <RoomPanelCard key={'panel-overlay'}
            panel={panel}
            roomConfig={room}
            viewType={(animation_stage == 1) ? 'detail' : 'collapsed'}
            layout={{margin: 0}} />
        </View>
        {header}
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_text: {
    color: '#000000',
    fontSize: 32,
    flex: 1,
  },
  cancel_container: {
    position: 'absolute',
    width: 60,
    height: 60,
    bottom: 10,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#000000',
  },
  cancel_image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  card_container: {
    position: 'absolute',
  }
});

module.exports = ReduxConnect(mapStateToProps) (RoomPanelOverlay);
