/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PropsType = {};
type StateType = {};

class AccountView extends React.Component<PropsType, StateType> {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Account
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 27
  }
});

module.exports = AccountView;
