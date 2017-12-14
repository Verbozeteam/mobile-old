/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const I18n = require('../i18n/i18n');

const RoomPanelCard = require('./RoomPanelCard');

type PropsType = {
  roomConfig: Object,
  showRoomName?: boolean,
  active: number
};

type StateType = {};

class Room extends React.Component<PropsType, StateType> {

  static defaultProps = {
    showRoomName: false,
    active: true
  };


  // NOTE: following code which is commented out scrolls the card to the top
  //       when pressed - do not need for now
  // _container_ref: Object = null;
  // _scroll_view_ref: Object = null;
  // _y_offset: number = 0;
  // _scroll_position: number = 0;

  // cardPressed(panel_name: string, layout: Object) {
  //   const { roomConfig } = this.props;
  //
  //   console.log(this._scroll_view_ref.scrollProperties);
  //   console.log(this._scroll_position);
  //
  //   const offset = layout.y - this._y_offset + this._scroll_position - 5;
  //
  //   this._scroll_view_ref.scrollTo({y: offset, animated: true});
  //
  //   // console.log(layout);
  //   // console.log(this._y_offset);
  //
  //   // this._scroll_view_ref.scrollTo({y: layout.y - this._y_offset, animated: true});
  //
  //   // this._measure(() => {
  //   //   this._scroll_view_ref.scrollTo({y: layout.y, animated: true});
  //   //
  //   // })
  // }

  // _scrollEnded(event: Object) {
  //   console.log('scroll ended');
  //   this._scroll_position = event.nativeEvent.contentOffset.y;
  // }

  // _measure(callback) {
  //   this._container_ref.measure((x, y, width, height, pageX, pageY) => {
  //     this._y_offset = pageY;
  //
  //     console.log('y_offset', this._y_offset);
  //
  //     if (typeof callback ==='function') {
  //       callback();
  //     }
  //   })
  // }

  render() {
    const { roomConfig, showRoomName, active } = this.props;

    var header: React.Component = null;
    if (showRoomName) {
      header = (
        <View style={styles.header}>
          <Text style={styles.header_text}>
            {I18n.t(roomConfig.name.en)}
          </Text>
        </View>
      )
    }

    /* create room control panels */
    var panels = [];
    for (var i = 0; i < roomConfig.grid.length; i++) {
      for (var j = 0; j < roomConfig.grid[i].panels.length; j++) {
        const panel = roomConfig.grid[i].panels[j];

        var bottom_margin = 5;
        if (i === roomConfig.grid.length - 1 &&
          j === roomConfig.grid[i].panels.length - 1) {
          bottom_margin = 15;
        }

        panels.push(
          <View key={'panel-' + panel.name.en + '-' + roomConfig.name.en}
            style={[styles.room_panel, {marginBottom: bottom_margin}]}>
            <RoomPanelCard roomConfig={roomConfig}
              panel={panel}
              active={active}
              panel={panel} />
          </View>
        );
      }
    }

    return (
      <View style={[styles.container, {opacity: (active) ? 1 : 0.25}]}>
        {header}
        {/* <View ref={c => this._container_ref = c}> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={active}
            style={styles.scroll_view}>
            {/* onScrollEndDrag={this._scrollEnded.bind(this)}
            onMomentumScrollEnd={this._scrollEnded.bind(this)}
            ref={c => this._scroll_view_ref = c}> */}
            {panels}
          </ScrollView>
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  room_panel: {
    marginTop: 5,
    marginBottom: 5,
  },
  scroll_view: {
    paddingTop: 5,
  },
  header: {
    paddingTop: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 1,
  },
  header_text: {
    fontFamily: 'CeraPRO-Bold',
    color: '#FFFFFF',
    fontSize: 27,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

module.exports = Room;
