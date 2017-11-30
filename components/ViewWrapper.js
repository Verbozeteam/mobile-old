/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopBar = require('./TopBar');

export function ViewWrapper(ChildView) {
  return class extends React.Component {
    render() {
      return (
        <View style={styles.container}>
          <TopBar />
          <ChildView />
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  contianer: {
    flex: 1
  }
});
