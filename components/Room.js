/* @flow */

import * as React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

type PropsType = {
  roomConfig: Object,
  showRoomName?: boolean
};

type StateType = {};

class Room extends React.Component<PropsType, StateType> {

  static defaultProps = {
    showRoomName: false
  };

  render() {
    const { roomConfig, showRoomName } = this.props;

    console.log('roomConfig', roomConfig);

    return (
      <View style={styles.container}>
        <Text>Some Room</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  }
});

module.exports = Room;
