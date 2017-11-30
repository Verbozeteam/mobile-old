/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

type PropsType = {
  name: string,
  index: number,
};

type StateType = {

};

class Room extends React.Component<PropsType, StateType> {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.room_name}>
          Room Name
        </Text>
      </View>
    );
  }
}

Room.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {

  },
  room_name: {
    fontSize: 32
  }
});

module.exports = Room;
