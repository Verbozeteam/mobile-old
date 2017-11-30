/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

type PropsType = {};
type StateType = {};

class TopBar extends React.Component<PropsType, StateType> {

  render() {
    return (
      <LinearGradient colors={['#36DBFD', '#178BFB']}
        start={{x: 1, y: 0}} end={{x: 0, y: 1}}
        style={styles.container}>
        <Text style={styles.header}>
          Mr. Hasan Al-Jawaheri
        </Text>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    fontSize: 27
  }
});

module.exports = TopBar;
