/* @flow */

import * as React from 'react';
import { View, Text, AppRegistry, StyleSheet, Platform, StatusBar }
  from 'react-native';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const WebSocketCommunication = require('./lib/WebSocketCommunication');

const ConnectionActions = require('./actions/connection');
const ThingsActions = require('./actions/things');

import Navigation from './navigation/Navigation';

import { WebSocketDataType, ConfigType } from './config/ConnectionTypes';

function mapStateToProps(state: Object) {
  return {
    connection_state: state.connection.connection_state,
    ws_url: state.connection.ws_url,
    config: state.connection.config,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    setConnectionState: (connection_state: number) => {
      dispatch(ConnectionActions.setConnectionState(connection_state));
    },
    setConfig: (config: Object) => {
      dispatch(ConnectionActions.setConfig(config));
    },
    setThingsStates: (things_states: Object) => {
      dispatch(ThingsActions.set_things_states(things_states));
    }
  };
}

class VerbozeMobile extends React.Component<any, any> {
  _Navigation: React.Component;

  componentWillMount() {
    /* bind websocket callbacks */
    WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
    WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
    WebSocketCommunication.setOnMessage(this.onMessage.bind(this));

    /* change status bar to light */
    StatusBar.setBarStyle('light-content', true);
    if (Platform.OS === 'android') {
      // TODO: update this color
      // StatusBar.setBackgroundColor('#13162b', true);
    }
  }

  componentDidMount() {
    /* connect websocket */
    this.connect();
  }

  componentWillReceiveProps(nextProps) {
    const { ws_url } = this.props;

    if (ws_url !== nextProps.ws_url) {
      this.disconnect();
    }
  }

  /* websocket connect */
  connect() {
    const { setConnectionState, ws_url } = this.props;

    WebSocketCommunication.connect(ws_url);
    setConnectionState(1);
  }

  disconnect() {
    const { setConnectionState } = this.props;

    WebSocketCommunication.disconnect();
    setConnectionState(0);
  }

  /* websocket callback on connect event */
  onConnected() {
    const { setConnectionState } = this.props;
    setConnectionState(2);

    console.log('sending code 0');
    WebSocketCommunication.sendMessage({
      code: 0
    });
  }

  /* websocket callback on disconnect event */
  onDisconnected() {
    const { setConnectionState, setConfig } = this.props;
    //setConnectionState(0);
    setConfig(null);

    setTimeout(this.connect.bind(this), 1000);
  }

  /* websocket callback on message event */
  onMessage(data: WebSocketDataType) {
    const { setConfig, setThingsStates } = this.props;

    /* set config if provided */
    if ('config' in data) {
      console.log("got config: ", data.config);
      setConfig(data.config);
      delete data['config'];
    }

    /* set things states if provided */
    if (Object.keys(data).length > 0) {
      setThingsStates(data);
    }
  }

  render() {
    const { overlay } = this.props;

    return (
      <View style={styles.container}>
        <Navigation />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
});

VerbozeMobile.contextTypes = {
  store: PropTypes.object
};

VerbozeMobile = ReduxConnect(mapStateToProps, mapDispatchToProps) (VerbozeMobile);

/**
 * Create the Redux store and srap the application in a Redux context
 */

import { createStore, combineReducers, bindActionCreators } from 'redux';
import { Provider } from 'react-redux';

const ConnectionReducer = require('./reducers/connection');
const ThingsReducer = require('./reducers/things');

const STORE = createStore(combineReducers({
  connection: ConnectionReducer,
  things: ThingsReducer,
}));

class VerbozeMobileWrapper extends React.Component<any> {
  render() {
    return <Provider store={STORE}>
      <VerbozeMobile />
    </Provider>
  }
}

module.exports = VerbozeMobileWrapper;
