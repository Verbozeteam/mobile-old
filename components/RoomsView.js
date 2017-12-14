/* @flow */

import * as React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

const RoomPanel = require('./RoomPanel');
const RoomPanelOverlay = require('./RoomPanelOverlay');

function mapStateToProps(state: Object) {
  return {
    config: state.connection.config,
    overlay: state.panels.overlaying_room_name
  };
}

type PropsType = {
  backgroundGradient: [string, string],
  margin: number,
  bleed: number,
};

type StateType = {
  selected_room: number,
  animated_dots: string
};

class RoomsView extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundGradient: ['#101821', '#131D28'],
    margin: 10,
    bleed: 10,
  };

  state = {
    selected_room: 0,
    animated_dots: ''
  };

  _scroll_view_ref: Object;
  _screen_width: number;
  _room_layout: LayoutType;
  _first_room_margin: LayoutType;
  _last_room_margin: LayoutType;

  _scroll_start_x: number = 0;

  _overlay_position: Object;
  _overlay_container: Object;

  _interval: number = null;

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

    index = 0;
    if (x_offset - this._scroll_start_x > 0) {
      index = higher_index;
    }

    else if (x_offset - this._scroll_start_x < 0) {
      index = lower_index;
    }

    // console.log(selected_room, approx_index, lower_index, higher_index);
    //
    // var index = 0;
    // if (x_offset - this._scroll_start_x > 0
    //     && approx_index + 1 - higher_index > 0.15) {
    //   console.log('higher');
    //   index = higher_index;
    // }
    //
    // else if (x_offset - this._scroll_start_x < 0
    //     && lower_index - approx_index > 0.15) {
    //   console.log('lower');
    //   index = lower_index;
    // }
    //
    if (index !== selected_room) {
      // console.log('index should change');
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

    this._first_room_layout = {
      marginLeft: bleed + margin
    };

    this._last_room_layout = {
      marginRight: bleed + margin
    };
  }

  measureOverlayContainer() {
    this._overlay_container.measure((x, y, width, height, pageX, pageY) => {
      this._overlay_position = {
        x: pageX,
        y: pageY
      }
    });
  }

  render() {
    const { config, backgroundGradient, margin, bleed, overlay } = this.props;
    const { selected_room, animated_dots } = this.state;

    var content = null;

    /* create rooms */
    if (config && config.rooms) {
      var length = config.rooms.length;
      if (length < 5) {
        for (var i = 0; i < length; i++) {
          config.rooms.push(config.rooms[i]);
        }
      }

      var rooms = [];
      for (var i = 0; i < config.rooms.length; i++) {

        var rooms_margin = {};
        if (i === 0) {
          rooms_margin = this._first_room_layout;
        }

        else if (i === config.rooms.length - 1) {
          rooms_margin = this._last_room_layout;
        }

        rooms.push(
          <View key={'room-' + i}
            style={[styles.room, this._room_layout, rooms_margin]}>
            <RoomPanel roomConfig={config.rooms[i]}
              showRoomName={config.rooms.length !== 1}
              active={selected_room === i} />
          </View>
        );
      }

      content = (
        <ScrollView ref={c => this._scroll_view_ref = c}
          horizontal={true}
          decelerationRate={'normal'}
          scrollEventThrottle={100}
          // onScroll={this._onScroll.bind(this)}
          showsHorizontalScrollIndicator={false}
          style={(overlay) ? {opacity: 0.1} : null}
          onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
          onScrollEndDrag={this._onScrollEndDrag.bind(this)}>
          {rooms}
        </ScrollView>
      );
    }

    /* create room loading text */
    else {
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
        start={{x: 0.5, y: 0}} end={{x: 0.5, y: 1}}
        style={styles.container}>
        {content}
        <View ref={c => this._overlay_container = c}
          onLayout={this.measureOverlayContainer.bind(this)}
          pointerEvents={(overlay) ? 'auto' : 'none'}
          style={styles.overlay}>
          {(overlay) ? <RoomPanelOverlay position={this._overlay_position}/> : null}
        </View>
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
    justifyContent: 'center'
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
