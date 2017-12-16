/* @flow */

import * as React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import { LayoutType } from '../config/flowtypes';

import LinearGradient from 'react-native-linear-gradient';

const RoomPanel = require('./RoomPanel');

function mapStateToProps(state: Object) {
  return {
    config: state.connection.config,
  };
}

type PropsType = {
  backgroundGradient: [string, string],
  margin: number,
  bleed: number,
  config: Object,
};

type StateType = {
  selected_room: number,
  animated_dots: string,
  isFullscreenMode: boolean, // kinda full-screen, you know
};

class RoomsView extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundGradient: ['#101821', '#131D28'],
    margin: 10,
    bleed: 10,
  };

  state = {
    selected_room: 0,
    animated_dots: '',
    isFullscreenMode: false,
  };

  _scroll_view_ref: Object;
  _screen_width: number;
  _totalHeight: number; // height of this control
  _room_layout: LayoutType;
  _room_layout_fullscreen: LayoutType;
  _first_room_margin: LayoutType;
  _last_room_margin: LayoutType;

  _scroll_start_x: number = 0;

  _interval: any = null;

  componentWillMount() {
    this.calculateRoomLayout();
  }

  componentWillReceiveProps(nextProps: PropsType) {
    clearInterval(this._interval);

    if (!nextProps.config || !nextProps.config.rooms) {
      this._interval = setInterval(() => this.animateTextDots(), 350);
    }
  }

  _onScrollBeginDrag(event: Object) {
    this._scroll_start_x = event.nativeEvent.contentOffset.x;
  }

  _onScrollEndDrag(event: Object) {
    const { margin } = this.props;

    const index = this.setApproximatedIndex(event.nativeEvent.contentOffset.x);

    const x = (this._room_layout.width + margin) * index;
    this._scroll_view_ref.scrollTo({x: x, animated: true});
  }

  setApproximatedIndex(x_offset: number): number {
    const { config } = this.props;
    const { selected_room } = this.state;

    var approx_index = x_offset / this._room_layout.width;
    var lower_index = Math.floor(approx_index);
    var higher_index = Math.ceil(approx_index);

    var index = 0;
    if (x_offset - this._scroll_start_x > 0)
      index = higher_index;
    else if (x_offset - this._scroll_start_x < 0)
      index = lower_index;

    if (index !== selected_room) {
      if (index < 0) {
        index = 0;
      }

      else if (index >= config.rooms.length) {
        index = config.rooms.length - 1;
      }

      this.setState({
        selected_room: index
      });

      return index;
    }

    return selected_room;
  }

  _onScroll(event: Object) {
    this.setApproximatedIndex(event.nativeEvent.contentOffset.x);
  }

  animateTextDots() {
    const { animated_dots } = this.state;

    this.setState({
      animated_dots: Array((animated_dots.length + 2) % 5).join('.')
    })
  }

  calculateRoomLayout() {
    const { margin, bleed } = this.props;

    /* get screen width */
    this._screen_width = Dimensions.get('screen').width;

    /* calculate room layout */
    this._room_layout = {
      width: this._screen_width - bleed * 2 - margin * 2,
      marginRight: margin / 2,
      marginLeft: margin / 2
    };
    this._room_layout_fullscreen = {
      width: this._screen_width - margin * 2,
      marginRight: margin,
      marginLeft: margin,
    };

    this._first_room_layout = {
      marginLeft: bleed + margin
    };

    this._last_room_layout = {
      marginRight: bleed + margin
    };
  }

  onContainerLayoutChanged(event: Object) {
    this._totalHeight = event.nativeEvent.layout.height;
  }

  toggleFullscreen() {
    this.setState({isFullscreenMode: !this.state.isFullscreenMode});
  }

  render() {
    const { config, backgroundGradient, margin, bleed } = this.props;
    const { selected_room, animated_dots, isFullscreenMode } = this.state;

    var content = null;

    /* create rooms */
    if (config && config.rooms) {
      var rooms = [];
      for (var i = 0; i < config.rooms.length; i++) {
        var rooms_margin = {};
        var rooms_layout = this._room_layout_fullscreen;
        if (!isFullscreenMode) {
          rooms_layout = this._room_layout;
          if (i === 0)
            rooms_margin = this._first_room_layout;
          else if (i === config.rooms.length - 1)
            rooms_margin = this._last_room_layout;
        }

        rooms.push(
          <View key={'room-' + i}
            style={[styles.room, rooms_layout, rooms_margin]}>
            <RoomPanel
              totalHeight={this._totalHeight}
              fullscreenToggle={this.toggleFullscreen.bind(this)}
              roomConfig={config.rooms[i]}
              showRoomName={config.rooms.length !== 1}
              active={selected_room === i} />
          </View>
        );
      }

      content = (
        <ScrollView ref={c => this._scroll_view_ref = c}
          scrollEnabled={!isFullscreenMode}
          horizontal={true}
          decelerationRate={'normal'}
          scrollEventThrottle={100}
          // onScroll={this._onScroll.bind(this)}
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
          onScrollEndDrag={this._onScrollEndDrag.bind(this)}>
          {rooms}
        </ScrollView>
      );
    } else {
      /* create room loading text */
      content = (
        <View style={styles.text_container}>
          <Text style={styles.center_text}>
            Connecting to room{animated_dots}
          </Text>
          <Text style={styles.center_subtext}>
            Please wait
          </Text>
        </View>
      );
    }

    return (
      <LinearGradient colors={backgroundGradient}
        onLayout={this.onContainerLayoutChanged.bind(this)}
        start={{x: 0.5, y: 0}} end={{x: 0.5, y: 1}}
        style={styles.container}>
        {content}
      </LinearGradient>
    );
  }
}

RoomsView.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  room: {
    flex: 1
  },
  text_container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  center_text: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#FFFFFF',
    fontSize: 27,
    fontFamily: 'CeraPRO-Medium'
  },
  center_subtext: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'CeraPRO-Light'
  }
});

module.exports = ReduxConnect(mapStateToProps) (RoomsView);
