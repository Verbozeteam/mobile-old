/* @flow */

import * as React from 'react';
import { View, Text, AppRegistry, StyleSheet } from 'react-native';

const GenericToggle = require('./components/GenericToggle');

type PropsType = {};

type State = {};

class VerbozeMobile extends React.Component<PropsType, StateType> {

  state = {
    toggle1: 0,
    toggle2: 0,
  };

  // websocket
  _ws: Object = null;

  componentDidMount() {

  }

  render() {

    /* FOLLOW CODE IS TEST CODE FOR GENERIC TOGGLE */
    const toggle1_actions = [
      () => {
        this.setState({toggle1: 0});
      },
      () => {
        this.setState({toggle1: 1});
      }
    ];

    const toggle2_actions = [
      () => {
        this.setState({toggle2: 0});
      },
      () => {
        this.setState({toggle2: 1});
      },
      () => {
        this.setState({toggle2: 2})
      }
    ];

    return (
      <View style={styles.container}>
          <GenericToggle actions={toggle1_actions}
            selected={this.state.toggle1} />
          <GenericToggle actions={toggle1_actions}
            selectedGradient={['#F5515F', '#9F041B']}
            selected={this.state.toggle1} />
          <GenericToggle values={['Off', 'Low', 'High']}
            actions={toggle2_actions}
            selected={this.state.toggle2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  }
});

module.exports = VerbozeMobile;
