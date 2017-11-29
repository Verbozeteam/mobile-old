/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

type PropsType = {
  id: string
};

type StateType = {
  intensity: number
};

class LightSwitch extends React.Component<PropsType, StateType> {

  state = {
    intensity: 0
  };

  componentWillMount() {
    const { store } = this.context;
    this._unsubscribe = store.subscribe(this.onReduxStateChange.bind(this));
    this.onReduxStateChange();
  }

  onReduxStateChange() {
    const { store } = this.context;
    const redux_state = store.getStore();
    const { intensity } = this.state;
    const { id } = this.props;

    try {
      const new_intensity = redux_state.things.thing_state[id].intensity;

      if (new_intensity!= undefined) {
        this.setState({
          intensity: new_intensity
        });
      }
    }

    catch(e) {}
  }

  changeIntensity(intensity: number) {
    const { id } = this.props;

    this.context.store.dispatch(ConnectionActions.setThingPartialState(
      id, {intensity}
    ));
  }

  render() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
}

LightSwitch.contextTypes = {
  store: PropTypes.object
};

const styles = StyleSheet.create({
  container: {

  }
});

module.exports = LightSwitch;
