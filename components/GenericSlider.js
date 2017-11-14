/* @flow */

import * as React from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import type { LayoutType, StyleType } from './config/flowtypes';

type PropsType = {
  // TODO: support vertical, will do once needed
  orientation?: 'vertical' | 'horizontal',

  /* provide maximum and minimum inclusive value range along with handlers */
  value?: number,
  maximum?: number,
  minimum?: number,
  round?: (value: number) => number,
  /* onMove doesn't necessarily need to update value passed through props -
     slider live updates on it's own */
  onMove?: (value: number) => null,
  /* onRelease must pass updated value through props or else slider will pop
     back to original value */
  onRelease?: (value: number) => null,

  /* override styling */
  layout?: LayoutType,
  fontColor?: string,
  sliderGradient?: [string, string],
  backgroundColor?: string,
  sliderMargin?: number,

  // TODO: for the futrue
  nightMode?: boolean
};

type StateType = {
  touch: boolean,
  touch_value: number,
  touch_start_value: number
};

class GenericSlider extends React.Component<PropsType, StateType> {

  static defaultProps = {
    orientation: 'horizontal',
    value: 50,
    maximum: 100,
    minimum: 0,
    round: (value) => Math.round(value),
    onMove: () => null,
    onRelease: () => null,
    fontColor: '#FFFFFF',
    sliderGradient: ['#36DBFD', '#178BFB'],
    backgroundColor: '#181B31',
    sliderMargin: 5,
    nightMode: true,
  };

  state = {
    touch: false,
    touch_value: 0,
    touch_exact_value: 0,
    touch_start_value: 0
  };

  /* default height and width for slider if non provided through props */
  _default_height: number = 70;
  _default_width: number = 250;

  /* info: only calculated once using layout in props, if layout changes
     these do not update unless the component is remounted */
  _container_layout: LayoutType | StyleType;
  _slider_layout: LayoutType | StyleType;
  _ratio: number;

  /* touch responder */
  _panResponder: Object;

  componentWillMount() {
    const { orientation, sliderMargin } = this.props;
    var { layout } = this.props;

    /* create touch responder */
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: this._onPanResponderGrant.bind(this),
      onPanResponderMove: this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this)
    });

    /* layout has not been passed through props, fallback to default */
    if (!layout) {
      layout = {
        height: (orientation === 'horizontal') ?
          this._default_height : this._default_width,
        width: (orientation === 'horizontal') ?
          this._default_width : this._default_height
      }
    }

    this._container_layout = {
      height: layout.height,
      width: layout.width,
      borderRadius: layout.height / 2
    };

    this._slider_layout = {
      left: sliderMargin,
      bottom: sliderMargin,
      borderRadius: (layout.height - sliderMargin * 2) / 2
    };

    if (orientation === 'horizontal') {
      this._slider_layout.height = layout.height - sliderMargin * 2;
    }
    else {
      this._slider_layout.width = layout.width - sliderMargin * 2;
    }

    this.calculateSliderRatio();
  }

  _onPanResponderGrant() {
    const { value, onStart } = this.props;

    this.setState({
      touch: true,
      touch_value: value,
      touch_start_value: value
    });
  }

  _onPanResponderMove(evt: Object, gestureState: {dx: number, dy: number}) {
    const { orientation, maximum, minimum, round, onMove } = this.props;
    const { touch_value, touch_start_value } = this.state;

    /* calculate gesture distance and limit value to remain within range */
    var new_value: number;
    if (orientation === 'horizontal') {
      new_value = touch_start_value + (gestureState.dx / this._ratio);
    }
    else {
      new_value = touch_start_value - (gestureState.dy / this._ratio);
    }
    var rounded_new_value: number = round(new_value);

    if (new_value > maximum) {
      new_value = maximum;
    }

    else if (new_value < minimum) {
      new_value = minimum;
    }

    this.setState({
      touch_value: new_value
    });

    /* if rounded value has changed, call provided onMove handler */
    if (rounded_new_value !== round(touch_value)) {
      onMove(rounded_new_value);
    }
  }

  _onPanResponderRelease() {
    const { round, onRelease } = this.props;
    const { touch_value } = this.state;

    this.setState({
      touch: false
    });

    /* call provided onRelease handler */
    onRelease(round(touch_value));
  }

  calculateSliderRatio() {
    const { orientation, maximum, minimum, round, sliderMargin } = this.props;

    if (orientation === 'horizontal') {
      this._ratio = (this._container_layout.width - sliderMargin * 2) /
        (maximum - minimum);
    }
    else {
      this._ratio = (this._container_layout.height - sliderMargin * 2) /
        (maximum - minimum);
    }
  }

  render() {
    const { orientation, minimum, round, fontColor, sliderGradient,
      backgroundColor } = this.props;
    var { value } = this.props;
    const { touch, touch_value } = this.state;

    /* if touches began, override provided value */
    if (touch) {
      value = touch_value;
    }

    const slider_size: LayoutType = {};
    if (orientation === 'horizontal') {
      slider_size.width = (value - minimum) * this._ratio;
    }
    else {
      slider_size.height = (value - minimum) * this._ratio;
    }

    return (
      <View style={[this._container_layout, {backgroundColor}]}>
        <View {...this._panResponder.panHandlers}
          style={styles.slider_container}>
          <LinearGradient colors={sliderGradient}
            start={{x: 1, y: 0}} end={{x: 0, y: 1}}
            style={[styles.slider, this._slider_layout, slider_size]}>
          </LinearGradient>

          <View style={styles.value_container}>
            <Text style={[styles.value_text, {color: fontColor}]}>
              {round(value)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider_container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  slider: {
    position: 'absolute'
  },
  value_container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
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

module.exports = GenericSlider;
