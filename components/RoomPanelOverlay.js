/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet, Platform, UIManager, ScrollView,
  LayoutAnimation } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const PanelsActions = require('../actions/panels');

import { isIphoneX } from 'react-native-iphone-x-helper';
import LinearGradient from 'react-native-linear-gradient';

const I18n = require('../i18n/i18n');

const RoomPanelCard = require('./RoomPanelCard');

function mapStateToProps(state: Object) {
  return {
    overlaying_room_name: state.panels.overlaying_room_name,
    overlaying_panel_name: state.panels.overlaying_panel_name,
    background_layout: state.panels.background_layout,
    config: state.connection.config
  };
}

type PropsType = {
  margin: number,
  position: {
    x: number,
    y: number
  }
};

type StateType = {
  /**
   * 0: no panel is selected for overlay, render one if available
   * 1: a panel has been rendered small, render the big one now
   * 2: big panel has been rendered, and should be collapsing now
   * 3: big panel finished collapsing
   * 4: panel will stop rendering
   */
  animation_stage: number,
  close_button_pressed: boolean
};

class RoomPanelOverlay extends React.Component<PropsType, StateType> {

  static defaultProps = {
    margin: 10
  };

  state = {
    animation_stage: 0,
    close_button_pressed: false
  };

  _detail_layout;
  _close_button_gradient: [string, string] = ['#EB4755', '#950011'];
  _close_button_highlight: [string, string] = ['#FF5B69', '#A90E25'];

  componentWillMount() {
    this.calculateLayout();

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  calculateLayout() {
    const { margin, background_layout, position } = this.props;

    this._collapsed_layout = {
      position: 'absolute',
      height: background_layout.height,
      width: background_layout.width,
      top: background_layout.y - position.y,
      left: background_layout.x - position.x,
      borderRadius: 5,
    }

    this._detail_layout = {
      flex: 1,
      margin,
    };
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
    const { animation_stage } = this.state;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    this.setState({
      animation_stage: (animation_stage + 1) % 5,
    });

    if (animation_stage === 3) {
      this.context.store.dispatch(PanelsActions.set_overlaying_panel('', '', {}));
    }
   }

  closePressedIn() {
    this.setState({
      close_button_pressed: true
    });
  }

  closeOverlay() {
    this.animationFrame();
  }

  render() {
    const { background_layout, hidden } = this.props;
    const { animation_stage, close_button_pressed } = this.state;

    var room = this.findSelectedRoom();
    var panel = this.findSelectedPanel();

    if (!room || !panel) {
      return <View />;
    }

    var close_button_gradient = this._close_button_gradient;
    if (close_button_pressed) {
      close_button_gradient = this._close_button_highlight;
    }

    var panel_layout = this._collapsed_layout;
    var bottom: React.Component = null;

    if (animation_stage === 0 || animation_stage === 2 || animation_stage === 3) {
      if (!(animation_stage === 0 &&
        Object.keys(background_layout).length == 0)) {

        /* advance animation frame */
        requestAnimationFrame(this.animationFrame.bind(this));
      }
    }

    else {
      panel_layout = this._detail_layout;

      bottom = (
        <View style={styles.bottom}>
          <View onTouchStart={this.closePressedIn.bind(this)}
            onTouchEnd={this.closeOverlay.bind(this)}
            style={styles.close_button}>
            <LinearGradient colors={close_button_gradient}
              start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{flex: 1}}>
              <Text style={styles.close_button_text}>
                Close
              </Text>
            </LinearGradient>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.full_container}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}
            style={[styles.panel, panel_layout]}>
            <RoomPanelCard key={'panel-overlay'}
              panel={panel}
              roomConfig={room}
              viewType={(animation_stage == 1) ? 'detail' : 'collapsed'} />
          </ScrollView>
          {bottom}
        </View>
      </View>
    );
  }
}

RoomPanelOverlay.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  full_container: {
    flex: 1,
  },
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  panel: {
    borderRadius: 5,
    overflow: 'hidden'
  },
  header: {

  },
  header_text: {
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  bottom: {
    height: 50,
    paddingRight: 10,
    paddingLeft: 10,
    width: '100%',
    bottom: 0,
    alignItems: 'center',
  },
  close_button: {
    borderRadius: 5,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  close_button_text: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'CeraPRO-Bold',
    color: '#FFFFFF',
    fontSize: 17,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

module.exports = ReduxConnect(mapStateToProps) (RoomPanelOverlay);
