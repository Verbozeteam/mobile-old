/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PropsType = {};
type StateType = {};

class AccountView extends React.Component<PropsType, StateType> {

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161819',
  },
  header: {
    fontSize: 27
  }
});

module.exports = AccountView;
