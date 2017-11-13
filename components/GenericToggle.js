/* @flow */

import * as React from 'react';
import { View, Text, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import type { LayoutType } from './config/flowtypes';

type PropsType = {
  // TODO: support vertical, will do once needed though
  orientation?: 'vertical' | 'horizontal',

  /* provide two arrays with the same length, the values to be shown in the
     toggle, as well as the respective function calls (actions)*/
  selected?: number,
  values?: Array<string>,
  actions?: Array<() => null>,

  /* override styling */
  layout?: LayoutType,
  fontColor?: string,
  selectedGradient?: [string, string],
  backgroundColor?: string,
  selectedMargin?: number,

  //TODO: for the future
  nightMode?: boolean
};

class GenericToggle extends React.Component<PropsType> {

  static defaultProps = {
    orientation: 'horizontal',
    selected: 0,
    values: ['On', 'Off'],
    actions: [() => null, () => null],
    layout: {
      height: 70,
      width: 250
    },
    fontColor: '#FFFFFF',
    selectedGradient: ['#36DBFD', '#178BFB'],
    backgroundColor: '#181B31',
    selectedMargin: 5,
    nightMode: true,
  };

  /* animated offset of the toggle selector */
  _animation_position;

  /* warning: only calculated once using layout in props, if layout changes
     these do not update unless the component is remounted */
  _container_layout: LayoutType;
  _selected_layout: LayoutType;


  /* warning: only created once, if values change or actions changes update
     won't show until component is remounted */
  _values: Array = [];

  constructor(props: PropsType) {
    super(props);

    const { layout, values, selectedMargin, selected } = props;

    this._container_layout = {
      height: layout.height,
      width: layout.width,
      borderRadius: layout.height / 2
    };

    this._selected_layout = {
      position: 'absolute',
      height: layout.height - selectedMargin * 2,
      // TODO: make this dynamic to values array strings lengths
      width: layout.width / values.length,
      borderRadius: (layout.height - selectedMargin * 2) / 2,
      top: selectedMargin
    };

    this._animation_position = new Animated.Value(selectedMargin);

    this.createValues();
  }

  createValues() {
    const { values, actions, selectedMargin, fontColor } = this.props;

    for (var i = 0; i < values.length; i++) {
      const action = actions[i];

      const value_style = {
        color: fontColor
      };

      if (i === 0) {
        value_style.marginLeft = selectedMargin;
      } else if (i === values.length - 1) {
        value_style.marginRight = selectedMargin;
      }

      this._values.push(
        <TouchableWithoutFeedback key={'value' + i}
          onPressIn={() => action()}>
          <View style={styles.value_container}>
            <Text style={[styles.value_text, value_style]}>
              {values[i]}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  calculateAnimationPosition() {
    const { selected, selectedMargin, values } = this.props;

    var position = this._selected_layout.width * selected;
    if (selected === 0) {
      position += selectedMargin;
    } else if (selected === values.length - 1) {
      position -= selectedMargin;
    }

    Animated.timing(this._animation_position, {
      toValue: position,
      duration: 150
    }).start();
  }

  render() {
    const { orientation, selected, values, actions, layout, fontColor,
      selectedGradient, backgroundColor, selectedMargin, nightMode }
       = this.props;

    /* calculate animation position of toggle selector */
    this.calculateAnimationPosition();

    const selected_position = {
      left: this._animation_position
    };

    return (
      <View style={[this._container_layout, {backgroundColor: backgroundColor}]}>
        <Animated.View style={selected_position}>
          <LinearGradient colors={selectedGradient}
            start={{x: 1, y: 0}} end={{x: 0, y: 1}}
            style={this._selected_layout}>
          </LinearGradient>
        </Animated.View>

        <View style={styles.values_container}>
          {this._values}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  values_container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  value_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value_text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  }
});

module.exports = GenericToggle;
