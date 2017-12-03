/* @flow */

import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type PropsType = {
  connection_state: 0 | 1 | 2
};

type StateType = {
  display_text: boolean,
  animated_dots: string;
};

class TopBarConnectionState extends React.Component<PropsType, StateType> {

  state = {
    display_text: true,
    animated_dots: ''
  };

  _disconnected_color: string = '#E23D3D';
  _connecting_color: string = '#F5A623';
  _connected_color: string = '#44B530';

  _interval: number = null;
  _timeout: number = null;

  connectionStateStringAndColor(): {text: string, color: string} {
    const { connection_state } = this.props;
    switch(connection_state) {
      case 0:
        return {text: 'Disconnected', color: this._disconnected_color};
      case 1:
        return {text: 'Connecting', color: this._connecting_color};
      case 2:
        return {text: 'Connected', color: this._connected_color};
    }
  }

  hideText() {
    this.setState({
      display_text: false
    });
  }

  animateTextDots() {
    const { animated_dots } = this.state;

    this.setState({
      animated_dots: Array((animated_dots.length + 2) % 5).join('.')
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    clearTimeout(this._timeout);
    clearInterval(this._interval);

    this.setState({
      display_text: true,
      animated_dots: ''
    });

    if (nextProps.connection_state == 1) {
      this._interval = setInterval(() => this.animateTextDots(), 150);
    }

    else {
      this._timeout = setTimeout(() => this.hideText(), 3000);
    }
  }

  render() {
    const { animated_dots, display_text } = this.state;
    const { text, color } = this.connectionStateStringAndColor();

    return (
      <View style={styles.container}>
        <View style={[styles.dot, {backgroundColor: color}]}></View>
        <Text style={styles.text}>{(display_text) ? text + animated_dots : ''}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    height: 15,
    width: 15,
    borderRadius: 10
  },
  text: {
    marginLeft: 5,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

module.exports = TopBarConnectionState;
