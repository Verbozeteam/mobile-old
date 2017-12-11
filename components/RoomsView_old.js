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

type StateType = {
  selected_room: number
};

class RoomsView extends React.Component<any, any> {

  state = {
    selected_room: 0
  };

  _container_ref: Object;
  _width: number;

  componentWillMount() {
    /* get screen width */
    this._width = Dimensions.get('screen').width;
  }

  render() {
    const { config } = this.props;
    const { selected_room } = this.state;

    /* center text */
    var header_text = null;

    /* create rooms */
    var rooms = [];
    if (config && config.rooms) {
      rooms.push(
        <View key={'room-card-3'}
          style={[styles.room, {width: this._width}]}>
          <Room roomConfig={config.rooms[0]} />
        </View>
      );

      for (var i = 0; i < config.rooms.length; i++) {
        rooms.push(
          <View key={'room-card-' + i}
            style={[styles.room, {width: this._width}]}>
            <Room roomConfig={config.rooms[i]} />
          </View>
        );
      }

      rooms.push(
        <View key={'room-card-4'}
          style={[styles.room, {width: this._width}]}>
          <Room roomConfig={config.rooms[1]} />
        </View>
      );

      // for (var i = 0; i < config.rooms.length; i++) {
      //   rooms.push(
      //     <View key={'room-card-' + i}
      //       style={[styles.room, {width: this._width - 20}]}>
      //       <Room roomConfig={config.rooms[i]} />
      //     </View>
      //   );
      // }
      // for (var i = 0; i < config.rooms.length; i++) {
      //   rooms.push(
      //     <View key={'room-card-' + i + 2}
      //       style={[styles.room, {width: this._width - 20}]}>
      //       <Room roomConfig={config.rooms[i]} />
      //     </View>
      //   );
      // }
      //
      // rooms[0]
    }

    /* set loading text */
    else {
      header_text = (
        <Text style={styles.header_text}>
          Loading...
        </Text>
      );
    }

    return (
      <LinearGradient colors={['#101821', '#131D28']}
        start={{x: 0.5, y: 0}} end={{x: 0.5, y: 1}}
        style={styles.container}>
        <ScrollView horizontal={true}
          pagingEnabled={true}>
          {rooms}
        </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  room: {
    // flex: 1,
    // backgroundColor: 'green'
  },
  header_text: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 27,
    textAlign: 'center'
  }
});

module.exports = ReduxConnect(mapStateToProps) (RoomsView);
