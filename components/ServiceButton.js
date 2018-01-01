/* @flow */

import * as React from 'react';
import { View, Image, Text, TouchableWithoutFeedback, StyleSheet }
  from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

type PropsType = {
  id: number,
  name: string,
  text?: string,
  image?: number,
  onPress: () => null,

  /* override style */
  backgroundGradient: [string, string],
  highlightGradient: [string, string]
};

type StateType = {
  pressed: boolean
};

class ServiceButton extends React.Component<PropsType, StateType> {

  static defaultProps = {
    text: '',
    onPress: () => null,
    backgroundGradient: ['#1c2f4f', '#0f1f3f'],
    highlightGradient: ['#26477f', '#0d2e70']
  }

  state = {
    pressed: false
  };

  _onPressIn() {
    this.setState({
      pressed: true
    });
  }

  _onPressOut() {
    this.setState({
      pressed: false
    });
  }


  render() {
    console.log('render called');

    const { id, name, text, image, onPress, highlightGradient } = this.props;
    var { backgroundGradient } = this.props;
    const { pressed } = this.state;

    if (pressed) {
      console.log('pressed');
      backgroundGradient = highlightGradient;
    }

    var button_image = null;
    if (image) {
      button_image = (
        <View style={styles.image_container}>
          <Image source={image}
            style={styles.image}
            resizeMode={'contain'} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback key={'service-button-' + id}
          onPressIn={this._onPressIn.bind(this)}
          onPress={() => onPress()}
          onPressOut={this._onPressOut.bind(this)}>
          <LinearGradient colors={backgroundGradient}
            start={{x: 1, y: 0}} end={{x: 0, y: 1}}
            style={styles.button}>
            <View style={{flex: 1}}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.text}>{text}</Text>
            </View>
            {button_image}
          </LinearGradient>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: 90,
    flex: 2
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 2,
    padding: 10
  },
  name: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'CeraPRO-Bold'
  },
  text: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontFamily: 'CeraPRO-Regular'
  },
  image_container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  image: {
    height: 50,
    width: 50
  }
});

module.exports = ServiceButton;
