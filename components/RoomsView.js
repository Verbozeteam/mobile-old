/* @flow */

import * as React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

const Room = require('./Room');

function mapStateToProps(state: Object) {
  return {
    config: state.connection.config
  };
}

type PropsType = {
  backgroundGradient: [string, string],
  roomsMargin: number
};

type StateType = {
  selected_room: number
};

class RoomsView extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundGradient: ['#101821', '#131D28'],
    roomsMargin: 10
  };

  state = {
    selected_room: 0
  };

  _scroll_view_ref: Object;
  _screen_width: number;

  componentWillMount() {
    /* get screen width */
    this._screen_width = Dimensions.get('screen').width;
  }

  _onScrollEndDrag(event: Object) {
    console.log('_onScrollEndDrag', event.nativeEvent.contentOffset.x);

    this._scroll_view_ref.scrollTo({x: 300, y: 0, animated: true});
  }

  render() {
    const { config, backgroundGradient, roomsMargin } = this.props;
    const { selected_room } = this.state;

    var content = null;

    /* create rooms */
    if (config && config.rooms) {
      // TODO: remove this
      const length = config.rooms.length;
      for (var i = 0; i < length; i++) {
        config.rooms.push(config.rooms[i]);
      }

      var rooms = [];
      for (var i = 0; i < config.rooms.length; i++) {

        const room_style = {
          width: this._screen_width - roomsMargin * 4,
          marginRight: roomsMargin / 2,
          marginLeft: roomsMargin / 2
        };

        if (i === 0) {
          room_style.marginLeft = roomsMargin * 2;
        }

        else if (i === config.rooms.length - 1) {
          room_style.marginRight = roomsMargin * 2;
        }

        rooms.push(
          <View key={'room-' + i}
            style={[styles.room, room_style]}>
            <Room roomConfig={config.rooms[i]}
              showRoomName={config.rooms.length === 1} />
          </View>
        );
      }

      content = (
        <ScrollView ref={c => this._scroll_view_ref = c}
          horizontal={true}
          onScrollEndDrag={this._onScrollEndDrag.bind(this)}
          style={[styles.rooms_container, {width: this._screen_width}]}>
          {rooms}
        </ScrollView>
      );
    }

    /* create room loading text */
    else {
      content = (
        <View style={styles.text_container}>
          <Text style={styles.center_text}>
            Connecting to room
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
  rooms_container: {
    flex: 1,
    backgroundColor: 'green'
  },
  room: {
    backgroundColor: 'red',
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
