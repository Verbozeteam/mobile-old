/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TopBar = require('./TopBar');

export function ViewWrapper(ChildView) {
  return class extends React.Component {
    render() {
      return (
        <View style={styles.contianer}>
          <TopBar {...this.props}/>
          <ChildView {...this.props}/>
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  contianer: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  }
});
