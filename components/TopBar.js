/* @flow */

import * as React from 'react';
import { View, Text, Image, StyleSheet, Platform, StatusBar }
  from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

const TopBarConnectionState = require('./TopBarConnectionState');

type PropsType = {
  navigation: {
    dispatch: Function,
    goBack: Function,
    navigate: Function,
    setParams: Function,
    state: Object
  },
  connection_state: 0 | 1 | 2,
  config: Object,

  backgroundColor: string
};

type StateType = {};

function mapStateToProps(state: Object) {
  return {
    connection_state: state.connection.connection_state,
    config: state.connection.config
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {

  };
}

class TopBar extends React.Component<PropsType, StateType> {

  static defaultProps = {
    backgroundColor: '#181B31',
  };

  _height: number = 80;

  _drawer_button: React.Component = null;
  _status_bar_height: number = 0;

  _hamburger: React.Component = null;

  _hotel_logo: number;
  _hotel_logo_height: number = 205;
  _hotel_logo_width: number = 1024;

  _hotel_photo: number;
  _hotel_photo_height: number = 220;
  _hotel_photo_width: number = 706;

  _container_layout: LayoutType;
  _content_layout: LayoutType;
  _hotel_photo_layout: LayoutType;

  componentWillMount() {
    const { navigation } = this.props;

    if (Platform.OS === 'android') {
      /* on Android, no need for status bar height */
      this._status_bar_height = 0;

      /* create hamburger for Android */
      this._hamburger = (
        <View style={styles.hamburger}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onTouchStart={() => navigation.navigate('DrawerOpen')}>
          <View style={styles.hamburger_stripe}></View>
          <View style={styles.hamburger_stripe}></View>
          <View style={styles.hamburger_stripe}></View>
        </View>
      );
    }

    else {
      /* set iOS status bar height - it is always 20 */
      this._status_bar_height = 20;
    }

    this._hotel_logo = require('../assets/millennium/logo.png');
    this._hotel_photo = require('../assets/millennium/photo.png');

    this.calculateLayout();
  }

  calculateLayout() {
    this._container_layout = {
      height: this._height + this._status_bar_height,
    };

    this._content_layout = {
      height: this._height,
    };

    this._hotel_photo_layout = {
      height: this._height,
      width: this._hotel_photo_width / (this._hotel_photo_height / this._height),
    };

    this._hotel_logo_layout = {
      height: this._height / 3,
      width: this._hotel_logo_width / (this._hotel_logo_height / this._height * 3),
    }
  }

  render() {
    const { backgroundColor, connection_state } = this.props;

    const room_number = '314';

    console.log(this._hotel_logo_layout);

    return (
      <View style={[styles.container, this._container_layout, {backgroundColor}]}>
        {/* ^ outside container bleeds underneath OS status bar */}

        {/* content container starts right underneath OS status bar */}
        <View style={[styles.content, this._content_layout]}>

          {/* hotel photo wrapped in View for positioning */}
          <View style={this._hotel_photo_layout}>
            <Image source={this._hotel_photo} style={this._hotel_photo_layout} resizeMode={'contain'} />
          </View>

          {/* gradient on top of photo */}
          <LinearGradient colors={['transparent', backgroundColor]}
            start={{x: -0.25, y: 0.5}} end={{x: 0.5, y: 0.5}}
            style={[styles.content, this._container_layout]}>
          </LinearGradient>

          {/* hamburger available if OS == android and connection state */}
          {this._hamburger}

          <View style={styles.connection_state}>
            <TopBarConnectionState connection_state={connection_state} />
          </View>

          <View style={[styles.hotel_logo, this._hotel_logo_layout]}>
            <Image source={this._hotel_logo} style={this._hotel_logo_layout} resizeMode={'contain'} />
          </View>

          <Text style={styles.room_number}>
            Room {room_number}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
  },
  content: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  hamburger: {
    position: 'absolute',
    top: 10,
    left: 10,
    height: 25,
    width: 27
  },
  hamburger_stripe: {
    height: 3,
    width: '100%',
    marginBottom: 5,
    backgroundColor: '#FFFFFF'
  },
  connection_state: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  hotel_logo: {
    position: 'absolute',
    top: 10,
    right: 10
  },
  room_number: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});

TopBar.contextTypes = {
  store: PropTypes.object
};

TopBar = ReduxConnect(mapStateToProps, mapDispatchToProps) (TopBar);

module.exports = TopBar;
